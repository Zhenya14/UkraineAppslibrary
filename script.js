document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================= */

    const publishModal = document.getElementById("publishModal");

    const openPublishButtons = [
        document.getElementById("openPublish"),
        document.getElementById("heroPublish"),
        document.getElementById("emptyPublish"),
        document.getElementById("promoPublish"),
        document.getElementById("mobilePublish")
    ];

    const closePublishButton =
        document.getElementById("closePublish");

    const cancelPublishButton =
        document.getElementById("cancelPublish");

    const modalOverlay =
        document.querySelector(".modal-overlay");

    const publishForm =
        document.getElementById("publishForm");

    const description =
        document.getElementById("materialDescription");

    const descriptionCount =
        document.getElementById("descriptionCount");

    const materialFile =
        document.getElementById("materialFile");

    const coverFile =
        document.getElementById("coverFile");

    const selectedFile =
        document.getElementById("selectedFile");

    const searchInput =
        document.getElementById("searchInput");

    const clearSearch =
        document.getElementById("clearSearch");


    /* =========================
       PUBLISH MODAL
    ========================= */

    function openPublishModal() {
        publishModal.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    function closePublishModal() {
        publishModal.classList.remove("active");

        document.body.style.overflow = "";
    }


    openPublishButtons.forEach(button => {

        if (button) {
            button.addEventListener(
                "click",
                openPublishModal
            );
        }

    });


    closePublishButton.addEventListener(
        "click",
        closePublishModal
    );


    cancelPublishButton.addEventListener(
        "click",
        closePublishModal
    );


    modalOverlay.addEventListener(
        "click",
        closePublishModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                publishModal.classList.contains("active")
            ) {
                closePublishModal();
            }

        }
    );


    /* =========================
       DESCRIPTION COUNTER
    ========================= */

    description.addEventListener(
        "input",
        () => {

            descriptionCount.textContent =
                description.value.length;

        }
    );


    /* =========================
       FILE PREVIEW
    ========================= */

    materialFile.addEventListener(
        "change",
        () => {

            if (!materialFile.files.length) {
                selectedFile.style.display = "none";
                selectedFile.textContent = "";
                return;
            }

            const file = materialFile.files[0];

            selectedFile.style.display = "block";

            selectedFile.innerHTML = `
                <span class="material-symbols-rounded">
                    description
                </span>
                ${escapeHtml(file.name)}
                · ${formatFileSize(file.size)}
            `;

        }
    );


    coverFile.addEventListener(
        "change",
        () => {

            if (!coverFile.files.length) {
                return;
            }

            const file = coverFile.files[0];

            if (file.size > 5 * 1024 * 1024) {

                alert(
                    "Обкладинка не може бути більшою за 5 МБ."
                );

                coverFile.value = "";

                return;
            }

        }
    );


    /* =========================
       SEARCH
    ========================= */

    searchInput.addEventListener(
        "input",
        () => {

            clearSearch.style.display =
                searchInput.value
                    ? "flex"
                    : "none";

            /*
             * Тут пізніше буде Firebase-пошук.
             *
             * Наприклад:
             *
             * library/books
             * orderByChild("title")
             */

        }
    );


    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            clearSearch.style.display = "none";

            searchInput.focus();

        }
    );


    /* =========================
       CATEGORIES
    ========================= */

    document
        .querySelectorAll(".category")
        .forEach(category => {

            category.addEventListener(
                "click",
                () => {

                    const selectedCategory =
                        category.dataset.category;

                    console.log(
                        "Категорія:",
                        selectedCategory
                    );

                    /*
                     * Пізніше:
                     *
                     * loadBooks({
                     *     category: selectedCategory
                     * });
                     */

                    document
                        .getElementById("library")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        });


    /* =========================
       PUBLISH
    ========================= */

    publishForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const title =
                document.getElementById(
                    "materialTitle"
                ).value.trim();

            const descriptionValue =
                description.value.trim();

            const category =
                document.getElementById(
                    "materialCategory"
                ).value;

            if (!title) {
                alert("Введи назву матеріалу.");
                return;
            }

            if (!descriptionValue) {
                alert("Додай опис матеріалу.");
                return;
            }

            if (!category) {
                alert("Обери категорію.");
                return;
            }

            if (!materialFile.files.length) {
                alert("Вибери файл матеріалу.");
                return;
            }

            const file =
                materialFile.files[0];

            if (
                file.size >
                50 * 1024 * 1024
            ) {

                alert(
                    "Файл матеріалу не може бути більшим за 50 МБ."
                );

                return;
            }


            /*
             * Firebase буде додано тут.
             *
             * Запланована структура:
             *
             * library/
             *   books/
             *     BOOK_ID/
             *
             * Storage:
             *
             * library/
             *   UID/
             *     BOOK_ID/
             *       cover.webp
             *       material.pdf
             */


            console.log(
                "Готово до Firebase-публікації:",
                {
                    title,
                    description: descriptionValue,
                    category,
                    fileName: file.name,
                    fileSize: file.size
                }
            );


            alert(
                "Форма готова. Firebase-публікацію буде підключено наступним кроком."
            );

        }
    );


    /* =========================
       HELPERS
    ========================= */

    function formatFileSize(bytes) {

        if (bytes < 1024) {
            return bytes + " B";
        }

        if (bytes < 1024 * 1024) {
            return (
                (bytes / 1024).toFixed(1) +
                " KB"
            );
        }

        return (
            (bytes / 1024 / 1024).toFixed(1) +
            " MB"
        );

    }


    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent = value;

        return div.innerHTML;

    }


    /* =========================
       INITIALIZATION
    ========================= */

    console.log(
        "UkraineApps Library запущено."
    );

});
