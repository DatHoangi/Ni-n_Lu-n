function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        document.querySelector(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                document.querySelector(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        });
}

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
    initJsToggle();
});

// Scroll ngang

document.addEventListener("DOMContentLoaded", () => {
    // Lấy phần tử danh sách cuộn ngang
    const checkoutList = document.querySelector(".checkout-list");

    let isDragging = false; // Biến để theo dõi trạng thái kéo chuột
    let startX; // Vị trí chuột khi bắt đầu kéo
    let scrollLeft; // Vị trí cuộn ngang khi bắt đầu kéo

    // Hàm kiểm tra kích thước màn hình và bật/tắt chức năng kéo chuột
    function checkWidth() {
        if (window.innerWidth > 768) {
            enableDragging();
        } else {
            disableDragging();
        }
    }

    // Hàm kích hoạt chức năng kéo chuột
    function enableDragging() {
        // Xử lý sự kiện khi nhấn chuột xuống
        checkoutList.addEventListener("mousedown", handleMouseDown);
        checkoutList.addEventListener("mouseleave", handleMouseLeave);
        checkoutList.addEventListener("mouseup", handleMouseUp);
        checkoutList.addEventListener("mousemove", handleMouseMove);

        // Xử lý sự kiện cảm ứng trên các thiết bị di động
        checkoutList.addEventListener("touchstart", handleTouchStart);
        checkoutList.addEventListener("touchend", handleTouchEnd);
        checkoutList.addEventListener("touchmove", handleTouchMove);
    }

    // Hàm tắt chức năng kéo chuột
    function disableDragging() {
        // Xóa các sự kiện kéo chuột và cảm ứng
        checkoutList.removeEventListener("mousedown", handleMouseDown);
        checkoutList.removeEventListener("mouseleave", handleMouseLeave);
        checkoutList.removeEventListener("mouseup", handleMouseUp);
        checkoutList.removeEventListener("mousemove", handleMouseMove);
        checkoutList.removeEventListener("touchstart", handleTouchStart);
        checkoutList.removeEventListener("touchend", handleTouchEnd);
        checkoutList.removeEventListener("touchmove", handleTouchMove);
    }

    // Xử lý sự kiện khi nhấn chuột xuống
    function handleMouseDown(e) {
        isDragging = true;
        startX = e.pageX - checkoutList.offsetLeft;
        scrollLeft = checkoutList.scrollLeft;
        checkoutList.style.cursor = "grabbing";
    }

    // Xử lý sự kiện khi chuột ra khỏi phần tử
    function handleMouseLeave() {
        isDragging = false;
        checkoutList.style.cursor = "grab";
    }

    // Xử lý sự kiện khi thả chuột
    function handleMouseUp() {
        isDragging = false;
        checkoutList.style.cursor = "grab";
    }

    // Xử lý sự kiện khi di chuyển chuột
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - checkoutList.offsetLeft;
        const walk = (x - startX) * 2;
        checkoutList.scrollLeft = scrollLeft - walk;
    }

    // Xử lý sự kiện cảm ứng trên các thiết bị di động
    function handleTouchStart(e) {
        isDragging = true;
        startX = e.touches[0].pageX - checkoutList.offsetLeft;
        scrollLeft = checkoutList.scrollLeft;
        checkoutList.style.cursor = "grabbing";
    }

    // Xử lý sự kiện khi kết thúc cảm ứng
    function handleTouchEnd() {
        isDragging = false;
        checkoutList.style.cursor = "grab";
    }

    // Xử lý sự kiện khi di chuyển cảm ứng
    function handleTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - checkoutList.offsetLeft;
        const walk = (x - startX) * 2;
        checkoutList.scrollLeft = scrollLeft - walk;
    }

    // Xử lý kích thước màn hình khi tải trang
    checkWidth();

    // Xử lý kích thước màn hình khi thay đổi kích thước cửa sổ
    window.addEventListener("resize", checkWidth);
});

// slide show
document.addEventListener("DOMContentLoaded", () => {
    const listImage = document.querySelector(".list-images");
    const imgs = document.querySelectorAll(".list-images .image");
    const length = imgs.length;
    let current = 0;
    let width = imgs[0].offsetWidth;
    let slideInterval;

    function updateSlidePosition() {
        listImage.style.transform = `translateX(${-width * current}px)`;
        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll(".dots-image .dot-item");
        dots.forEach((dot, index) => {
            dot.classList.toggle("dot-active", index === current);
        });
    }

    function startSlideInterval() {
        // Clear existing interval if any
        clearInterval(slideInterval);

        // Start new interval
        slideInterval = setInterval(() => {
            current = (current + 1) % length;
            updateSlidePosition();
        }, 4000);
    }

    document.querySelector(".btn-left").addEventListener("click", () => {
        current = current === 0 ? length - 1 : current - 1;
        updateSlidePosition();
        startSlideInterval(); // Reset the interval on button click
    });

    document.querySelector(".btn-right").addEventListener("click", () => {
        current = (current + 1) % length;
        updateSlidePosition();
        startSlideInterval(); // Reset the interval on button click
    });

    // Start the initial interval
    startSlideInterval();

    // Initial update of dots on page load
    updateDots();
});

// Blog
document.addEventListener("DOMContentLoaded", () => {
    let listItems = document.querySelectorAll(".blog__list-item .blog-list");
    let borderItems = document.querySelectorAll(".blog-border__item");
    let btns = document.querySelectorAll(".blog-item__btn"); // Các nút điều hướng

    let currentIndex = 0;
    let autoSlideInterval = setInterval(nextItem, 10000); // Tự động chuyển đổi mỗi 10 giây

    function updateDisplay() {
        listItems.forEach((listItem, index) => {
            listItem.style.transform = `translateX(-${currentIndex * 100}%)`;
        });

        borderItems.forEach((borderItem, index) => {
            borderItem.classList.toggle("active", index === currentIndex);
        });
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % listItems.length;
        updateDisplay();
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
        updateDisplay();
    }

    function resetAutoSlideInterval() {
        clearInterval(autoSlideInterval); // Dừng tự động chuyển đổi
        autoSlideInterval = setInterval(nextItem, 10000); // Khởi động lại tự động chuyển đổi
    }

    // Xử lý sự kiện cho các nút điều hướng
    btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            if (e.target.closest(".next-btn")) {
                nextItem();
                resetAutoSlideInterval(); // Reset thời gian chuyển đổi
            } else if (e.target.closest(".prev-btn")) {
                prevItem();
                resetAutoSlideInterval(); // Reset thời gian chuyển đổi
            }
        });
    });

    // Cập nhật khi nhấn vào các chấm điều hướng
    borderItems.forEach((borderItem, index) => {
        borderItem.addEventListener("click", () => {
            currentIndex = index;
            updateDisplay();
            resetAutoSlideInterval(); // Reset thời gian chuyển đổi
        });
    });

    // Khởi tạo hiển thị ban đầu
    updateDisplay();
});

// TESTIMONIALS
document.addEventListener("DOMContentLoaded", () => {
    let testimonialsList = document.querySelector(".testimonials__list");
    let items = document.querySelectorAll(
        ".testimonials__list .testimonials-evaluate"
    );
    let next = document.querySelector(".testimonials-btn__right");
    let prev = document.querySelector(".testimonials-btn__left");
    let dots = document.querySelectorAll(".testimonials-border__item");

    let lengthItems = items.length - 1;
    let active = 0;

    function reloadTestimonials() {
        items.forEach((item, index) => {
            item.classList.toggle("hidden", index !== active);
        });

        // Cập nhật trạng thái của các chấm điều hướng
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === active);
        });

        // Xóa interval cũ và khởi tạo lại
        clearInterval(refreshInterval);
    }

    // Chuyển đến testimonial tiếp theo
    next.onclick = function () {
        active = active + 1 <= lengthItems ? active + 1 : 0;
        reloadTestimonials();
    };

    // Chuyển đến testimonial trước đó
    prev.onclick = function () {
        active = active - 1 >= 0 ? active - 1 : lengthItems;
        reloadTestimonials();
    };

    // Cập nhật testimonial khi nhấn vào chấm điều hướng
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            active = index;
            reloadTestimonials();
        });
    });

    // Khởi tạo testimonials
    reloadTestimonials();
});
