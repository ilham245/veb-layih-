document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    let carId = parseInt(urlParams.get('id'));

    // Əgər ayrıca açılıbsa təsadüfən 1ci maşını göstəririk ki, boş səhifə olmasın.
    if (!carId) {
        carId = 1; 
    }

    const car = carData.find(c => c.id === carId);

    if (!car) {
        document.body.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>Belə bir avtomobil yoxdur</h2>";
        return;
    }

    // Məlumatların html-ə köçürülməsi
    document.getElementById("carMainImage").src = car.images[0];
    
    // Qalereya şəkillərini əlavə et
    const gallery = document.getElementById("carGallery");
    car.images.forEach((imgUrl, index) => {
        const thumb = document.createElement("img");
        thumb.src = imgUrl;
        thumb.className = "gallery-thumb";
        // Birinci şəkil avtomatik seçilir
        if(index === 0) thumb.classList.add("active");
        
        thumb.addEventListener("click", () => {
            // Əsas şəkli dəyiş
            document.getElementById("carMainImage").src = imgUrl;
            
            // Aktiv class-nı idarə et
            document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
        });
        gallery.appendChild(thumb);
    });

    document.getElementById("carTitle").textContent = car.brand;
    document.getElementById("carPrice").textContent = car.price;
    document.getElementById("specMarka").textContent = car.marka;
    document.getElementById("specModel").textContent = car.model;
    document.getElementById("specYear").textContent = car.year;
    document.getElementById("specYeni").textContent = car.yeni;
    document.getElementById("specMileage").textContent = car.mileage;
    document.getElementById("specMarket").textContent = car.bazar;
    document.getElementById("specCity").textContent = car.seher;
    document.getElementById("specColor").textContent = car.reng;
    document.getElementById("specEngine").textContent = car.muherrik;
    document.getElementById("specPhone").textContent = car.elaqe;

    // Şərhlər funksiyaları
    const commentsList = document.getElementById("commentsList");

    async function renderComments() {
        commentsList.innerHTML = '<h3>Şərhlər</h3>';
        try {
            const res = await fetch(`http://localhost:5000/api/comments/${carId}`);
            const comments = await res.json();
            
            if (comments.length === 0) {
                commentsList.innerHTML += '<p style="color:#aaa;">İlk şərhi siz yazın.</p>';
                return;
            }
            
            comments.forEach(c => {
                 const commentItem = document.createElement("div");
                 commentItem.className = "comment-item";
                 const displayCarName = c.car_name ? ` <span style="font-size:0.85rem; font-weight:normal; color:#888;">| ${c.car_name}</span>` : '';
                 commentItem.innerHTML = `
                     <div class="comment-author">${c.user_name}${displayCarName}</div>
                     <div class="comment-text">${c.text}</div>
                 `;
                 commentsList.appendChild(commentItem);
            });
        } catch (err) {
            commentsList.innerHTML += '<p style="color:#ff4d4d;">Şərhləri yükləmək mümkün olmadı.</p>';
            console.error(err);
        }
    }

    renderComments();

    const authBox = document.getElementById("authBox");
    const commentWriteBox = document.getElementById("commentWriteBox");
    const authEmailInput = document.getElementById("authEmail");
    const authPasswordInput = document.getElementById("authPassword");
    const authMessage = document.getElementById("authMessage");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userNameInput = document.getElementById("userName");

    // Email inputunda 1-dən çox '@' işarəsinin yazılmasına məhdudiyyət
    authEmailInput.addEventListener('input', function(e) {
        let val = e.target.value;
        const firstAtIndex = val.indexOf('@');
        if (firstAtIndex !== -1) {
            const beforeAt = val.slice(0, firstAtIndex + 1);
            const afterAt = val.slice(firstAtIndex + 1).replace(/@/g, '');
            e.target.value = beforeAt + afterAt;
        }
    });

    // Postgres Node API ilə idarə olunur.
    
    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            authBox.style.display = "none";
            commentWriteBox.style.display = "block";
            // Pre-fill user name with email handle if empty
            if (!userNameInput.value) {
                // capitalize first letter of email prefix
                const prefix = currentUser.split('@')[0];
                userNameInput.value = prefix.charAt(0).toUpperCase() + prefix.slice(1);
            }
        } else {
            authBox.style.display = "block";
            commentWriteBox.style.display = "none";
        }
    }

    loginBtn.addEventListener("click", async () => {
        const email = authEmailInput.value.trim();
        const password = authPasswordInput.value.trim();
        if (!email || !password) {
            authMessage.style.color = "#ff4d4d";
            authMessage.textContent = "Zəhmət olmasa email və parolu daxil edin.";
            return;
        }
        if (!email.includes('@')) {
            authMessage.style.color = "#ff4d4d";
            authMessage.textContent = "emaildə @ simvolundan istifadə edilməlidir";
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('currentUser', email);
                authMessage.style.color = "green";
                authMessage.textContent = data.message;
                setTimeout(() => {
                    authMessage.textContent = "";
                    checkAuth();
                }, 500);
            } else {
                authMessage.style.color = "#ff4d4d";
                authMessage.textContent = data.error || "Giriş zamanı xəta.";
            }
        } catch (err) {
            authMessage.style.color = "#ff4d4d";
            authMessage.textContent = "Serverlə əlaqə qurmaq mümkün olmadı.";
            console.error(err);
        }
    });

    registerBtn.addEventListener("click", async () => {
        const email = authEmailInput.value.trim();
        const password = authPasswordInput.value.trim();
        if (!email || !password) {
            authMessage.style.color = "#ff4d4d";
            authMessage.textContent = "Qeydiyyat üçün email və parolu daxil edin.";
            return;
        }
        if (!email.includes('@')) {
            authMessage.style.color = "#ff4d4d";
            authMessage.textContent = "emaildə @ simvolundan istifadə edilməlidir";
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('currentUser', email);
                authMessage.style.color = "green";
                authMessage.textContent = data.message;
                setTimeout(() => {
                    authMessage.textContent = "";
                    checkAuth();
                }, 500);
            } else {
                authMessage.style.color = "#ff4d4d";
                authMessage.textContent = data.error || "Qeydiyyat zamanı xəta.";
            }
        } catch (err) {
            authMessage.style.color = "#ff4d4d";
            authMessage.textContent = "Serverlə əlaqə qurmaq mümkün olmadı.";
            console.error(err);
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem('currentUser');
        authEmailInput.value = "";
        authPasswordInput.value = "";
        authMessage.textContent = "";
        userNameInput.value = "";
        checkAuth();
    });

    checkAuth();

    const commentForm = document.getElementById("commentForm");
    commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const commentInput = document.getElementById("userComment");
        
        const userName = userNameInput.value.trim();
        const text = commentInput.value.trim().replace(/\n/g, '<br>');
        const currentUser = localStorage.getItem('currentUser');
        const carName = car ? (car.brand || car.marka) : "Avtomobil";

        if (userName !== "" && text !== "") {
            try {
                const response = await fetch('http://localhost:5000/api/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ carId, userEmail: currentUser, userName, carName, text })
                });

                if (response.ok) {
                    await renderComments();
                    commentInput.value = "";
                } else {
                    alert("Şərh göndərilərkən xəta baş verdi.");
                }
            } catch (err) {
                console.error(err);
                alert("Serverlə əlaqə qurmaq mümkün olmadı.");
            }
        }
    });
});

