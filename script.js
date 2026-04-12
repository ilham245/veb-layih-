document.addEventListener("DOMContentLoaded", () => {
    const carsGrid = document.getElementById("carsGrid");

    carData.forEach(car => {
        const carCard = document.createElement("a");
        carCard.href = `car.html?id=${car.id}`;
        carCard.className = "car-card";
        carCard.style.textDecoration = 'none';

        // Əsas səhifədə maşının bütün fərqləndirici detalları (Yürüş, Marka, Bazar və s.) görünür
        carCard.innerHTML = `
            <img src="${car.images[0]}" alt="${car.brand}" class="car-image">
            <div class="car-details">
                <h3 class="car-price">${car.price}</h3>
                <h4 class="car-brand">${car.brand}</h4>
                
                <div class="car-mini-specs">
                    <span>${car.year} il</span>
                    <span>${car.mileage}</span>
                    <span>${car.muherrik}</span>
                    <span>${car.reng}</span>
                    <span>${car.seher}</span>
                    <span>Yeni: ${car.yeni}</span>
                    <span>Bazar: ${car.bazar}</span>
                </div>
                
                <div class="car-contact" style="margin-top:20px; font-size:1.1rem; color:var(--primary); font-weight:700;">
                    📞 Xətlə Əlaqə: <br> ${car.elaqe}
                </div>
            </div>
        `;
        carsGrid.appendChild(carCard);
    });
});
