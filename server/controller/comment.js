const db = require("../config/database");
const sendEmail = require("../utils/sendEmail");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

// create a comment (optimized)
exports.createcomment = async (req, res) => {
  const { id: memoId, userId, deptId, subject } = req.body;
  const currentDate = new Date();

  try {
    // ✅ Insert comment first
    const comment = await db.insert(
      `INSERT INTO comments (memo_id, user_id, depart_id, comment, comment_date)
       VALUES (?,?,?,?,?)`,
      [memoId, userId, deptId, subject, currentDate.toLocaleString()]
    );

    if (!comment) {
      return res.status(400).json({ message: "Failed to save comment" });
    }

    // ✅ Fetch memo details once
    const [memoDetails] = await db.query("SELECT subject FROM memos WHERE id = ?", [memoId]);
    if (!memoDetails) {
      return res.status(404).json({ message: "Memo not found" });
    }
    const { subject: memoSubject } = memoDetails;

    // ✅ Fetch all involved users (excluding commenter)
    const userIdsResult = await db.query(
      "SELECT user_id FROM notifications WHERE memo_id = ? AND user_id != ?",
      [memoId, userId]
    );
    const userIds = userIdsResult.map(u => u.user_id);
    if (userIds.length === 0) {
      return res.status(200).json({ message: "Comment added (no other users to notify)" });
    }

    // ✅ Fetch all users in one query (emails + expo tokens)
    const users = await db.query(
      "SELECT email, expo FROM users WHERE id IN (?)",
      [userIds]
    );

    // ✅ Prepare email + push promises
    const emailAndPushTasks = users.map(user => {
      // Email
      const mailOptions = {
        from: "notify@polarpetrochemicalsltd.com",
        to: user.email,
        subject: "POMEM - Memo Update: New Comment Added",
        html: `
          <div style="background-color: red; color: white; padding: 10px; text-align: center;">
            <h1>POMEM</h1>
          </div>
          <p>Hello,</p>
          <p>A new comment has been added to the memo you are involved in.</p>
          <p><strong>Subject:</strong> ${memoSubject}</p>
          <p><strong>Memo ID:</strong> ${memoId}</p>
          <p>Please log in to POMEM to view the update.</p>
          <p>Best Regards,<br>POMEM Notification Service</p>
        `
      };
      console.log(user.expo)
      // Push notification
      let pushPromise = null;
      if (user.expo && Expo.isExpoPushToken(user.expo)) {
        const message = {
          to: user.expo,
          sound: "pomemgingle.mp3",
          title: "🗒️ Memo Update",
          body: `New comment added on "${memoSubject}"`,
          data: { memo_id: memoId },
        };
        const chunks = expo.chunkPushNotifications([message]);
        pushPromise = Promise.all(chunks.map(chunk => expo.sendPushNotificationsAsync(chunk)));
      }

      // Return both promises (in parallel)
      return Promise.allSettled([sendEmail(mailOptions), pushPromise]);
    });

    // ✅ Run all sends concurrently
    await Promise.allSettled(emailAndPushTasks);

    // ✅ Done
    res.status(201).json({ message: "Comment added and notifications sent successfully" });
  } catch (error) {
    console.error("❌ createcomment error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
