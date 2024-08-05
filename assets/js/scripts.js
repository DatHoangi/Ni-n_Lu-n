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

document.addEventListener('DOMContentLoaded', () => {
    // Lấy phần tử danh sách cuộn ngang
    const checkoutList = document.querySelector('.checkout-list');

    let isDragging = false; // Biến để theo dõi trạng thái kéo chuột
    let startX; // Vị trí chuột khi bắt đầu kéo
    let scrollLeft; // Vị trí cuộn ngang khi bắt đầu kéo

    // Xử lý sự kiện khi nhấn chuột xuống
    checkoutList.addEventListener('mousedown', (e) => {
        isDragging = true; // Đặt trạng thái kéo chuột là đúng
        startX = e.pageX - checkoutList.offsetLeft; // Tính toán vị trí chuột khi bắt đầu kéo
        scrollLeft = checkoutList.scrollLeft; // Lưu vị trí cuộn ngang khi bắt đầu kéo
        checkoutList.style.cursor = 'grabbing'; // Thay đổi con trỏ thành "grabbing" khi kéo
    });

    // Xử lý sự kiện khi chuột ra khỏi phần tử
    checkoutList.addEventListener('mouseleave', () => {
        isDragging = false; // Đặt trạng thái kéo chuột là sai
        checkoutList.style.cursor = 'grab'; // Thay đổi con trỏ thành "grab" khi không kéo
    });

    // Xử lý sự kiện khi thả chuột
    checkoutList.addEventListener('mouseup', () => {
        isDragging = false; // Đặt trạng thái kéo chuột là sai
        checkoutList.style.cursor = 'grab'; // Thay đổi con trỏ thành "grab" khi không kéo
    });

    // Xử lý sự kiện khi di chuyển chuột
    checkoutList.addEventListener('mousemove', (e) => {
        if (!isDragging) return; // Nếu không kéo chuột thì không làm gì
        e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
        const x = e.pageX - checkoutList.offsetLeft; // Tính toán vị trí chuột hiện tại
        const walk = (x - startX) * 2; // Tính toán khoảng cách di chuyển (2 là hệ số điều chỉnh tốc độ cuộn)
        checkoutList.scrollLeft = scrollLeft - walk; // Cập nhật vị trí cuộn ngang của danh sách
    });

    // Xử lý sự kiện cảm ứng trên các thiết bị di động
    checkoutList.addEventListener('touchstart', (e) => {
        isDragging = true; // Đặt trạng thái kéo chuột là đúng
        startX = e.touches[0].pageX - checkoutList.offsetLeft; // Tính toán vị trí chạm khi bắt đầu kéo
        scrollLeft = checkoutList.scrollLeft; // Lưu vị trí cuộn ngang khi bắt đầu kéo
        checkoutList.style.cursor = 'grabbing'; // Thay đổi con trỏ thành "grabbing" khi kéo
    });

    // Xử lý sự kiện khi kết thúc cảm ứng
    checkoutList.addEventListener('touchend', () => {
        isDragging = false; // Đặt trạng thái kéo chuột là sai
        checkoutList.style.cursor = 'grab'; // Thay đổi con trỏ thành "grab" khi không kéo
    });

    // Xử lý sự kiện khi di chuyển cảm ứng
    checkoutList.addEventListener('touchmove', (e) => {
        if (!isDragging) return; // Nếu không kéo chuột thì không làm gì
        e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
        const x = e.touches[0].pageX - checkoutList.offsetLeft; // Tính toán vị trí chạm hiện tại
        const walk = (x - startX) * 2; // Tính toán khoảng cách di chuyển (2 là hệ số điều chỉnh tốc độ cuộn)
        checkoutList.scrollLeft = scrollLeft - walk; // Cập nhật vị trí cuộn ngang của danh sách
    });
});


