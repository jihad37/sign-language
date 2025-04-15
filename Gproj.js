function showApp() {
    document.getElementById("home-content").style.display = "none";
    document.getElementById("app-content").style.display = "block";
    document.getElementById("login-content").style.display = "none"; // ⬅️ ده السطر اللي كان ناقص
    document.getElementById("camera-section").style.display = "none";

    document.getElementById("home-link").classList.remove("active");
    document.getElementById("app-link").classList.add("active");
    document.getElementById("show-login-link").classList.remove("active");

    document.getElementById("login-link").classList.remove("active"); // لو حابة تنظفي الكلاسات كمان
}

function showHome() {
    document.getElementById("home-content").style.display = "block";
    document.getElementById("app-content").style.display = "none";
    document.getElementById("login-content").style.display = "none"; 
    
    document.getElementById("home-link").classList.add("active");
    document.getElementById("app-link").classList.remove("active");
    document.getElementById("login-link").classList.remove("active");
    document.getElementById("show-login-link").classList.remove("active");

}

function showLogin() {
    document.getElementById("login-content").style.display = "block";
    document.getElementById("home-content").style.display = "none";
    document.getElementById("app-content").style.display = "none";  
    document.getElementById("camera-section").style.display = "none";

    document.getElementById("login-link").classList.add("active");
    document.getElementById("show-login-link").classList.add("active");

    document.getElementById("home-link").classList.remove("active");
    document.getElementById("app-link").classList.remove("active");
}
document.getElementById("show-login-link").addEventListener("click", showLogin);

let currentStream = null;

    function showCamera() {

    document.getElementById("home-content").style.display = "none";
    document.getElementById("app-content").style.display = "none";
      // إخفاء الصفحة الرئيسية
      document.getElementById("home-content").classList.remove("active");

      // إظهار الكاميرا
      document.getElementById("camera-section").classList.add("active");

      // تشغيل الكاميرا
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          document.getElementById("camera").srcObject = stream;
          currentStream = stream;
        })
        .catch(err => {
          console.error("فشل في تشغيل الكاميرا:", err);
          alert("حدث خطأ أثناء تشغيل الكاميرا");
        });
    }
    function stopCameraOnly() {
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
          currentStream = null;
        }
      }
    
  const toggleBtn = document.getElementById("toggle-btn");
  const overlayText = document.getElementById("overlay2-text");
  const signUpForm = document.querySelector(".sign-up");
  const signInForm = document.querySelector(".sign-in");
  const overlay = document.querySelector(".overlay2");
  toggleBtn.addEventListener("click", () => {
      if (signInForm.style.left === "50%") {
          signInForm.style.left = "100%";
          signUpForm.style.left = "0";
          overlay.style.right = "0";
          toggleBtn.textContent = "تسجيل الدخول";
          overlayText.textContent = "دخول إلى حسابك";
          document.body.style.background = "url('https://source.unsplash.com/1600x900/?nature,water') no-repeat center center/cover";
      } else {
          signInForm.style.left = "50%";
          signUpForm.style.left = "-50%";
          overlay.style.right = "50%";
          toggleBtn.textContent = "إشتراك";
          overlayText.textContent = "تسجيل جديد";
          document.body.style.background = "url('https://source.unsplash.com/1600x900/?city,night') no-repeat center center/cover";
      }
  });


  document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const sentence = document.getElementById('sentence');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const resetButton = document.getElementById('reset-button');
    const readButton = document.getElementById('read-button');
    const translateButton = document.getElementById('translate-button');
    const languageButton = document.getElementById('language-button');
    const deleteButton = document.getElementById('delete-button');
    const exitButton = document.getElementById('exit-button');
    const loading = document.getElementById('loading');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    let detectionActive = false;
    let currentLanguage = 'arabic';
    let detectedSentence = '';

    // بدء الكشف
    startButton.addEventListener('click', startDetection);

    // إيقاف الكشف
    stopButton.addEventListener('click', stopDetection);

    // إعادة تعيين الجملة
    resetButton.addEventListener('click', () => {
        detectedSentence = '';
        sentence.textContent = 'الجملة المكتشفة: ';
        Swal.fire({
            icon: 'success',
            title: 'تم إعادة تعيين الجملة!',
            showConfirmButton: false,
            timer: 1500
        });
    });

    // قراءة الجملة
    readButton.addEventListener('click', () => {
        if (detectedSentence) {
            const utterance = new SpeechSynthesisUtterance(detectedSentence);
            // تحديد اللغة بناءً على محتوى الجملة
            if (/[\u0600-\u06FF]/.test(detectedSentence)) {
                utterance.lang = 'ar-SA'; // إذا كانت الجملة تحتوي على أحرف عربية
            } else {
                utterance.lang = 'en-US'; // إذا كانت الجملة بالإنجليزية
            }
            speechSynthesis.speak(utterance);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'لا توجد جملة مكتشفة!',
                text: 'يرجى بدء الكشف أولاً.',
            });
        }
    });

    // ترجمة الجملة
    translateButton.addEventListener('click', async () => {
        if (detectedSentence) {
            try {
                const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(detectedSentence)}&langpair=${currentLanguage === 'arabic' ? 'ar|en' : 'en|ar'}`);
                const data = await response.json();
                const translatedText = data.responseData.translatedText;
                Swal.fire({
                    title: 'الترجمة',
                    text: translatedText,
                    icon: 'info',
                });
            } catch (error) {
                console.error('Error translating:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ في الترجمة',
                    text: 'حدث خطأ أثناء محاولة الترجمة.',
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'لا توجد جملة مكتشفة!',
                text: 'يرجى بدء الكشف أولاً.',
            });
        }
    });

    // تبديل اللغة
    languageButton.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'arabic' ? 'english' : 'arabic';
        languageButton.textContent = currentLanguage === 'arabic' ? 'تبديل إلى الإنجليزية' : 'تبديل إلى العربية';
    });

    // مسح الحرف الأخير
    deleteButton.addEventListener('click', () => {
        detectedSentence = detectedSentence.slice(0, -1);
        sentence.textContent = `الجملة المكتشفة: ${detectedSentence}`;
    });

    // إغلاق التطبيق
    exitButton.addEventListener('click', () => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: 'سيتم إغلاق التطبيق.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، أغلق',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                window.close();
            }
        });
    });

    async function startDetection() {
        detectionActive = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        loading.classList.remove('hidden');

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        setInterval(async () => {
            if (detectionActive) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const image = canvas.toDataURL('image/jpeg');

                const formData = new FormData();
                formData.append('file', dataURLtoFile(image, 'frame.jpg'));
                formData.append('language', currentLanguage);

                try {
                    const response = await fetch('http://127.0.0.1:5000/detect', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) throw new Error('Network response was not ok');

                    const result = await response.json();
                    const detectedLetters = result.detected_letters;

                    if (detectedLetters.length > 0) {
                        detectedSentence += detectedLetters.join('');
                        sentence.textContent = `الجملة المكتشفة: ${detectedSentence}`;
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'حدث خطأ أثناء الكشف',
                        text: 'يرجى المحاولة مرة أخرى.',
                    });
                } finally {
                    loading.classList.add('hidden');
                }
            }
        }, 1000);
    }

    function stopDetection() {
        detectionActive = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    function dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
});
 