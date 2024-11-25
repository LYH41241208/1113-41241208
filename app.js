// 引入 Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAmp2HSTIeY77XeNQ07LTj2FieTANVEVv8",
  authDomain: "project-1557777538837266180.firebaseapp.com",
  databaseURL: "https://project-1557777538837266180-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "project-1557777538837266180",
  storageBucket: "project-1557777538837266180.appspot.com",
  messagingSenderId: "960392995220",
  appId: "1:960392995220:web:8960102be395efe3146f81"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Google 註冊按鈕事件
document.getElementById("registerBtn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();

  // Google 登入並註冊
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const currentTime = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });

      // 將資料存入 Firebase Realtime Database
      set(ref(database, `members/${user.uid}`), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: currentTime
      });

      alert("註冊成功！現在您已經登入。");
      displayUserInfo(user.displayName, user.email, user.photoURL, currentTime);
    })
    .catch((error) => {
      console.error("註冊失敗：", error.message);
    });
});

// Google 登入按鈕事件
document.getElementById("loginBtn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();

  // Google 登入
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const userRef = ref(database, `members/${user.uid}`);

      // 檢查會員是否已註冊
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          // 如果已註冊，更新最後登入時間並顯示資訊
          const currentTime = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
          set(userRef, {
            ...snapshot.val(), // 保留原有資料
            lastLogin: currentTime // 更新最後登入時間
          });

          const data = snapshot.val();
          displayUserInfo(data.name, data.email, data.photoURL, currentTime);
        } else {
          // 如果尚未註冊
          alert("您尚未註冊！請先完成註冊再登入。");
        }
      });
    })
    .catch((error) => {
      console.error("登入失敗：", error.message);
    });
});

// 顯示會員資訊
function displayUserInfo(name, email, photoURL, lastLogin) {
  const userInfo = document.getElementById("userInfo");
  userInfo.innerHTML = `
    <h3>會員資訊</h3>
    <p><b>姓名：</b>${name}</p>
    <p><b>Email：</b>${email}</p>
    <img src="${photoURL}" alt="會員照片" class="img-thumbnail" width="150">
    <p><b>最後登入時間：</b>${lastLogin}</p>
  `;
}
