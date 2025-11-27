const db = require("../config/database");
const sendEmail = require("../utils/sendEmail")
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

// Create a memo
exports.creatememo = async (req, res) => {
  const { 
    fromWho, 
    fromDept, 
    toWho, 
    throughWho, 
    category, 
    subject, 
    content,
    confidential 
  } = req.body;

  const currentDate = new Date();
  const status = "Pending";

  try {
    // Insert memo with confidential status
    const memo = await db.insert(
      `INSERT INTO memos 
        (date_created, date_updated, department_id, category_id, raised_by, toWho, throughWho, status, subject, content, confidential)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        currentDate.toLocaleString(),
        currentDate.toLocaleString(),
        fromDept,
        category,
        fromWho,
        toWho,
        throughWho,
        status,
        subject,
        content,
        confidential ? 1 : 0,   // store as integer (0 or 1)
      ]
    );

    if (!memo) return res.status(400).json({ message: "Failed to create memo" });

    // Gather user IDs to notify
    const userIds = [toWho, throughWho].filter(Boolean);

    const users = await db.query(
      "SELECT id, email, expo FROM users WHERE id IN (?)",
      [userIds]
    );

    // Save notifications
    const notificationValues = userIds.map((uid) => [
      memo,
      uid,
      currentDate.toLocaleString(),
    ]);

    await db.insert(
      "INSERT INTO notifications (memo_id, user_id, date_updated) VALUES ?",
      [notificationValues]
    );

    // Prepare send tasks
    const sendTasks = users.map((user) => {
      const roleLabel = user.id === toWho ? "Recipient" : "Intermediary";

      const mailOptions = {
        from: "notify@polarpetrochemicalsltd.com",
        to: user.email,
        subject: confidential 
          ? "🔒 POMEM - Confidential Memo Assigned"
          : "POMEM - New Memo Notification",
        html: `
          <div style="background-color: red; color: white; padding: 10px; text-align: center;">
            <h1>POMEM</h1>
          </div>
          <p>Hello,</p>
          <p>You have been assigned a new ${confidential ? "<strong>CONFIDENTIAL</strong>" : ""} memo as <strong>${roleLabel}</strong>.</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Memo ID:</strong> ${memo}</p>
          <p>Please log in to POMEM to review and take action.</p>
        `,
      };

      // Push notification
      let pushPromise = null;
      if (user.expo && Expo.isExpoPushToken(user.expo)) {
        const message = {
          to: user.expo,
          sound: "pomemgingle.mp3",
          title: confidential 
            ? "🔒 Confidential Memo Assigned"
            : "📄 New Memo Assigned",
          body: confidential
            ? `A confidential memo has been assigned to you.`
            : `You have a new memo as ${roleLabel}: "${subject}"`,
          data: { memo_id: memo, confidential },
        };

        const chunks = expo.chunkPushNotifications([message]);
        pushPromise = Promise.all(chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk)));
      }

      return Promise.allSettled([sendEmail(mailOptions), pushPromise]);
    });

    await Promise.allSettled(sendTasks);

    res.status(201).json({
      message: `Memo raised successfully${confidential ? " (Confidential)" : ""} with notifications sent`,
    });

  } catch (error) {
    console.error("❌ Error creating memo:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


//Get one memo
exports.getmemo = async (req, res) => {
  const { id } = req.params;
  try {
    const memo = await db.getall("SELECT * FROM memos WHERE id = ?", [id]);
    const commentsForMemo = await db.getall(
      "SELECT users.firstname, users.lastname, departments.dept_name, comments.comment, comments.comment_date FROM comments, users, staff, departments WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = comments.user_id AND comments.memo_id = ?",
      [id]
    );
    if (memo) {
      const createdBy = await db.getall(
        "SELECT users.firstname, users.lastname, departments.dept_name FROM users, staff, departments  WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = ?",
        [memo[0].raised_by]
      );
      const toWho = await db.getall(
        "SELECT users.firstname, users.lastname, departments.dept_name FROM users, staff, departments  WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = ?",
        [memo[0].toWho]
      );
      const throughWho = await db.getall(
        "SELECT users.firstname, users.lastname, departments.dept_name FROM users, staff, departments  WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = ?",
        [memo[0].throughWho]
      );
      if (commentsForMemo) {
        res.status(201).json({
          memo: memo[0],
          createdBy: createdBy[0],
          toWho: toWho[0],
          throughWho: throughWho[0],
          comments: commentsForMemo,
        });
      } else {
        console.log({
          memo: memo[0],
          createdBy: createdBy[0],
          toWho: toWho[0],
          throughWho: throughWho[0],
        });
        res.status(201).json({
          memo: memo[0],
          createdBy: createdBy[0],
          toWho: toWho[0],
          throughWho: throughWho[0],
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

// Get all memos (with pagination, no search)
exports.allmemos = async (req, res) => {
  let { page = 1, limit = 24 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 24;
  const offset = (page - 1) * limit;

  try {
    // Count total memos for pagination
      const countResult = await db.getall(
      `SELECT COUNT(*) AS total FROM memos WHERE confidential = 0`
    );

    const totalMemos = countResult[0].total;
    const totalPages = Math.ceil(totalMemos / limit);

    // Fetch paginated memos
    const memos = await db.getall(
      `SELECT 
          users.id AS user_id, 
          users.firstname, 
          users.lastname, 
          departments.id AS department_id, 
          departments.dept_name, 
          categories.id AS category_id, 
          categories.cat_name, 
          memos.id as memo_id, 
          memos.date_created, 
          memos.subject, 
          memos.status
       FROM memos
       JOIN departments ON memos.department_id = departments.id
       JOIN categories ON memos.category_id = categories.id
       JOIN users ON memos.raised_by = users.id
       WHERE memos.confidential = 0
       ORDER BY memos.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalMemos,
      limit,
      memos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

// Get memos by search (with pagination)
exports.allmemosbysearch = async (req, res) => {
  const { searchName = "" } = req.body;
  let { page = 1, limit = 10} = req.query;

  // Convert types
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = (page - 1) * limit;

  try {
    // Count total memos
    const countResult = await db.getall(
      `SELECT COUNT(*) AS total
       FROM memos
       JOIN departments ON memos.department_id = departments.id
       JOIN categories ON memos.category_id = categories.id
       JOIN users ON memos.raised_by = users.id
       WHERE memos.subject LIKE ? OR memos.id LIKE ?,
       WHERE memos.confidential = 0`,
      [`%${searchName}%`, `%${searchName}%`]
    );

    const totalMemos = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalMemos / limit);

    // Fetch paginated memos
    const memos = await db.getall(
      `SELECT 
          users.id AS user_id, 
          users.firstname, 
          users.lastname, 
          departments.id AS department_id, 
          departments.dept_name, 
          categories.id AS category_id, 
          categories.cat_name, 
          memos.id AS memo_id, 
          memos.date_created, 
          memos.subject, 
          memos.status 
       FROM memos
       JOIN departments ON memos.department_id = departments.id
       JOIN categories ON memos.category_id = categories.id
       JOIN users ON memos.raised_by = users.id
       WHERE memos.subject LIKE ? OR memos.id LIKE ?
       WHERE memos.confidential = 0
       ORDER BY memos.id DESC
       LIMIT ? OFFSET ?`,
      [`%${searchName}%`, `%${searchName}%`, limit, offset]
    );

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalMemos,
      limit,
      memos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

//Get all memos by category
exports.allmemosbycategory = async (req, res) => {
  const { id } = req.params; // category_id
  const { page = 1, limit = 10 } = req.query;
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
    // 🧮 1. Count total memos for pagination
    const countResult = await db.getall(
      `SELECT COUNT(*) AS total
       FROM memos
       WHERE memos.category_id = ?`,
      [id]
    );

    const totalMemos = countResult[0].total;
    const totalPages = Math.ceil(totalMemos / parsedLimit);

    // 📄 2. Fetch paginated memos by category
    const memos = await db.getall(
      `SELECT 
        users.id AS user_id, 
        users.firstname, 
        users.lastname, 
        departments.id AS department_id, 
        departments.dept_name, 
        categories.id AS category_id, 
        categories.cat_name, 
        memos.id AS memo_id, 
        memos.date_created, 
        memos.subject, 
        memos.status
       FROM memos
       JOIN departments ON memos.department_id = departments.id
       JOIN categories ON memos.category_id = categories.id
       JOIN users ON memos.raised_by = users.id
       WHERE memos.category_id = ?
       ORDER BY memos.id DESC
       LIMIT ? OFFSET ?`,
      [id, parsedLimit, offset]
    );

    // ✅ 3. Send paginated response
    res.status(200).json({
      currentPage: parsedPage,
      totalPages,
      totalMemos,
      limit: parsedLimit,
      memos,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

// Get all memos created by a particular user with search + pagination
exports.allmemosbyuser = async (req, res) => {
  const { id } = req.params; // user id
  const { page = 1, limit = 10, search = "" } = req.query;

  const offset = (page - 1) * limit;

  try {
    // Count total memos for pagination
    const countResult = await db.getall(
      `SELECT COUNT(*) AS total 
       FROM memos 
       WHERE raised_by = ? 
         AND (subject LIKE ? OR id LIKE ?)`,
      [id, `%${search}%`, `%${search}%`]
    );

    const totalMemos = countResult[0].total;
    const totalPages = Math.ceil(totalMemos / limit);

    // Fetch paginated + searched memos
    const memos = await db.getall(
      `SELECT 
          users.id AS user_id, 
          users.firstname, 
          users.lastname, 
          departments.id AS department_id, 
          departments.dept_name, 
          categories.id AS category_id, 
          categories.cat_name, 
          memos.id as memo_id, 
          memos.date_created, 
          memos.subject, 
          memos.status
       FROM memos
       JOIN departments ON memos.department_id = departments.id
       JOIN categories ON memos.category_id = categories.id
       JOIN users ON memos.raised_by = users.id
       WHERE memos.raised_by = ?
         AND (memos.subject LIKE ? OR memos.id LIKE ?)
       ORDER BY memos.id DESC
       LIMIT ? OFFSET ?`,
      [id, `%${search}%`, `%${search}%`, parseInt(limit), parseInt(offset)]
    );

    res.status(200).json({
      currentPage: parseInt(page),
      totalPages,
      totalMemos,
      limit: parseInt(limit),
      memos,
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};
  
// Get all memos created by a particular user (with search + pagination)
exports.allmemostoattend = async (req, res) => {
  const { id } = req.params;
  const status = "Pending";

  // Pagination defaults
  let { page = 1, limit = 10, search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  try {
    // Build search filter
    const searchQuery =
      search && search.trim() !== ""
        ? `AND (memos.subject LIKE ? OR memos.id LIKE ?)`
        : "";

    const params = search
      ? [status, id, `%${search}%`, `%${search}%`, limit, offset]
      : [status, id, limit, offset];

    // Query with pagination + search
    const memo = await db.getall(
      `
      SELECT DISTINCT
        users.id AS user_id, users.firstname, users.lastname, 
        departments.id AS department_id, departments.dept_name, 
        categories.id AS category_id, categories.cat_name, 
        memos.id as memo_id, memos.date_created, memos.subject, memos.status
      FROM memos
      JOIN departments ON memos.department_id = departments.id
      JOIN categories ON memos.category_id = categories.id
      JOIN notifications ON memos.id = notifications.memo_id
      JOIN users ON memos.raised_by = users.id
      WHERE memos.status = ? AND notifications.user_id = ? ${searchQuery}
      ORDER BY memos.id DESC
      LIMIT ? OFFSET ?
      `,
      params
    );

    // Count total for pagination
    const countParams = search
      ? [status, id, `%${search}%`, `%${search}%`]
      : [status, id];

    const totalResult = await db.getall(
      `
      SELECT COUNT(*) AS total
      FROM memos
      JOIN departments ON memos.department_id = departments.id
      JOIN categories ON memos.category_id = categories.id
      JOIN notifications ON memos.id = notifications.memo_id
      JOIN users ON memos.raised_by = users.id
      WHERE memos.status = ? AND notifications.user_id = ? ${searchQuery}
      `,
      countParams
    );

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      memos: memo,
      totalMemos: total,
      currentPage:page,
      limit,
      totalPages: Math.ceil(total / limit),
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};


//Get all user count
exports.allmemocount = async (req, res) => {
  try {
    const countAll = await db.getall("SELECT id FROM memos");
    const countApproved = await db.getall(
      "SELECT id FROM memos WHERE status = 'Approved'",
      []
    );
    const countPending = await db.getall(
      "SELECT id FROM memos WHERE status = 'Pending'",
      []
    );
    const countRejected = await db.getall(
      "SELECT id FROM memos WHERE status = 'Rejected'",
      []
    );
    if (countApproved || countPending || countRejected) {
      res.status(201).json({
        AllMemos: countAll.length,
        Approved: countApproved.length,
        Pending: countPending.length,
        Rejected: countRejected.length,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//edit the memo 
exports.updatememo = async (req, res) => {
  const { id } = req.params; // memo ID to update
  const status = "Pending";
  const {
    fromWho,
    fromDept,
    toWho,
    throughWho,
    category,
    subject,
    content,
  } = req.body;
  const currentDate = new Date();
  try {
    // Check if the memo exists
    const existingMemo = await db.query("SELECT * FROM memos WHERE id = ?", [
      id,
    ]);
    if (!existingMemo || existingMemo.length === 0) {
      return res.status(404).json({ message: "Memo not found" });
    }

    // Update all editable fields except status
    const updateQuery = `
      UPDATE memos
      SET 
        date_updated = ?,
        department_id = ?,
        category_id = ?,
        raised_by = ?,
        toWho = ?,
        throughWho = ?,
        subject = ?,
        content = ?,
        status = ?
      WHERE id = ?
    `;

    await db.update(updateQuery, [
      currentDate.toLocaleString(),
      fromDept,
      category,
      fromWho,
      toWho,
      throughWho,
      subject,
      content,
      status,
      id,
    ]);

    res.status(200).json({ message: "Memo updated successfully" });
  } catch (error) {
    console.error("Error updating memo:", error);
    res.status(500).json({ message: "Something went wrong while updating memo" });
  }
};

//update one memo status
exports.updatememostatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const currentDate = new Date();
  try {
    const memostatus = await db.update(
      "UPDATE memos SET status = ?, date_updated = ? WHERE id = ?",
      [status, currentDate.toLocaleString(), id]
    );
    if (memostatus) {
      res.status(201).json(memostatus);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//send memo notifcation
exports.memonotifcation = async (req, res) => {
  const { memo_id, user_id } = req.body;
  const currentDate = new Date();

  try {
    const SendMemoTo = await db.insert(
      "INSERT INTO notifications (memo_id, user_id, date_updated) VALUES (?,?,?)",
      [memo_id, user_id, currentDate.toLocaleString()]
    );
    if (SendMemoTo) {
      // Fetch memo details
      const memoDetails = await db.query("SELECT * FROM memos WHERE id = ?", [
        memo_id,
      ]);

      if (memoDetails.length > 0) {
        const { subject } = memoDetails[0];

        // Fetch email of toWho user
        const toWhoEmail = await db.query(
          "SELECT email FROM users WHERE id = ?",
          [user_id]
        );

        // Fetch email of toWho user
        const toWhoToken = await db.query(
          "SELECT expo FROM users WHERE id = ?",
          [user_id]
        );

        if (toWhoEmail.length > 0) {
          const mailOptionsToWho = {
            from: "notify@polarpetrochemicalsltd.com",
            to: toWhoEmail[0]?.email,
            subject: "POMEM - URGENT: Memo Notification",
            html: `
              <div style="background-color: red; color: white; padding: 10px; text-align: center;">
                <h1>POMEM</h1>
              </div>
              <p>Hello,</p>
              <p>This is to inform you that you are involved in a critical memo with the following details </p>
              <p style="font-weight: bold; color: red;">Subject: ${subject}</p>
              <p style="font-weight: bold; color: red;">Memo ID: <span style="color: red;">${memo_id}</span></p>
              <p>Time is of the essence, and your prompt attention to this matter is crucial.</p>

              <p>Best Regards.</p>
            `,
          };
          await sendEmail(mailOptionsToWho);

          // ✅ Send Expo push notification (if token exists and valid)
          if (toWhoToken && Expo.isExpoPushToken(toWhoToken)) {
            const messages = [
              {
                to: toWhoToken,
                sound: 'pomemgingle.mp3',
                title: '📄 New Memo Assigned',
                body: `You have a new memo to attend to : "${subject}"`,
                data: { memo_id },
              },
            ];

            const chunks = expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
              try {
                await expo.sendPushNotificationsAsync(chunk);
              } catch (error) {
                console.error("Expo push error:", error);
              }
            }
          } else {
            console.warn(`Invalid or missing Expo token for user ID ${user_id}`);
          }
        }
        }   
        res.status(201).json({ message: "Memo Sent Successfully" });
      }
    }
   catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//delete one memo
exports.deletememo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.delete("DELETE FROM memos WHERE id = ?", [id]);
    if (result) {
      res.status(201).json({ message: "Memo Successfully Deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};
