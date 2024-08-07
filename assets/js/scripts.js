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
