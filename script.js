firebase.initializeApp({
  apiKey: "AIzaSyDXiLOi_lFBjffofMAFMUCjPvRTpBl2Grg",
  authDomain: "videovortex-235cd.firebaseapp.com",
  databaseURL: "https://videovortex-235cd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "videovortex-235cd",
  storageBucket: "videovortex-235cd.appspot.com",
  messagingSenderId: "681594250269",
  appId: "1:681594250269:web:c6eb258b0803e8b7d052f4",
  measurementId: "G-5EBPY9YHSK"
});

  // Initialize Firebase
  const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();
let currentUser = null;
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

    const logoutButton =
        document.getElementById("logoutButton");

    const clearSearch =
        document.getElementById("clearSearch");

    const libraryGrid =
        document.getElementById("libraryGrid");


    /* =========================
       PUBLISH MODAL
    ========================= */

    function openPublishModal() {
        const user = firebase.auth().currentUser;

  if (!user) {
    
    alert("Потрібно увійти в акаунт");
    return;
  }
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

logoutButton.addEventListener(
        "click", () => {
            auth.signOut();
        }
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

    let activeCategory = null;

    document
        .querySelectorAll(".category")
        .forEach(category => {

            category.addEventListener(
                "click",
                () => {

                    const selectedCategory =
                        category.dataset.category;

                    activeCategory = selectedCategory;

                    console.log(
                        "Категорія:",
                        selectedCategory
                    );

                    document
                        .getElementById("library")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                    libraryGrid
                        .querySelectorAll(".library-book")
                        .forEach(book => {
                            book.hidden =
                                book.dataset.category !== selectedCategory;
                        });
                }
            );

        });

    database.ref("library/books").on("child_added", snapshot => {
        const book = snapshot.val();
        const bookId = snapshot.key;
        if (!book) {
            return;
        }

        libraryGrid.querySelector(".empty-library")?.remove();

        const card = document.createElement("article");
        card.className = "library-book";
        card.dataset.bookId = bookId;
        card.dataset.category = book.category || "";
        card.hidden = Boolean(
            activeCategory && book.category !== activeCategory
        );

        const categoryLabel = document.createElement("span");
        categoryLabel.className = "library-book-category";
        categoryLabel.textContent = book.category || "Без категорії";

        const title = document.createElement("h3");
        title.textContent = book.title || "Матеріал без назви";

        const descriptionText = document.createElement("p");
        descriptionText.textContent = book.description || "";

        const fileName = document.createElement("small");
        fileName.textContent = book.fileName || "";

        card.append(categoryLabel, title, descriptionText);

        if (book.downloadURL) {
            const downloadLink = document.createElement("a");
            downloadLink.className = "library-book-download";
            downloadLink.href = book.downloadURL;
            downloadLink.target = "_blank";
            downloadLink.rel = "noopener noreferrer";
            downloadLink.textContent = `Завантажити ${book.fileName || "матеріал"}`;
            card.append(downloadLink);
        } else if (book.fileName) {
            card.append(fileName);
        }
        const moreBtn = document.createElement("button");
        moreBtn.type = "button";
        moreBtn.classList.add("more-btn");
        moreBtn.innerHTML = `<i class="material-symbols-rounded">more_vert</i>`;

        const actionMenu = document.createElement("div");
        actionMenu.classList.add("action-menu");
        actionMenu.style.display = "none";
        if (currentUser === book.uid || currentUser === "L7FRYTytp6MhWbgq69w5mPFy0bJ3") {
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.innerHTML = `<i class="material-symbols-rounded">delete</i> Видалити`;

            deleteButton.onclick = async () => {
                if (!window.confirm("Видалити цей матеріал?")) {
                    return;
                }

                deleteButton.disabled = true;
                try {
                    await database.ref(`library/books/${bookId}`).remove();
                    if (book.storagePath) {
                        try {
                            await storage.ref(book.storagePath).delete();
                        } catch (storageError) {
                            console.error("Не вдалося видалити файл матеріалу:", storageError);
                        }
                    }
                    card.remove();
                } catch (error) {
                    console.error("Не вдалося видалити матеріал:", error);
                    alert("Не вдалося видалити матеріал. Перевір правила Firebase.");
                    deleteButton.disabled = false;
                }
                actionMenu.style.display = "none";
            };

            actionMenu.appendChild(deleteButton);
        }
        card.appendChild(moreBtn);
        card.appendChild(actionMenu);

        moreBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            actionMenu.style.display = actionMenu.style.display === "none" ? "flex" : "none";
        });
        libraryGrid.append(card);
    }, error => {
        console.error("Не вдалося прочитати library/books:", error);

        let errorMessage = libraryGrid.querySelector(".library-load-error");
        if (!errorMessage) {
            errorMessage = document.createElement("p");
            errorMessage.className = "library-load-error";
            libraryGrid.prepend(errorMessage);
        }

        errorMessage.textContent =
            `Не вдалося завантажити книги з Firebase: ${error.message}`;
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

            const bookRef = database.ref("library/books").push();
            const bookId = bookRef.key;

            const storageRef = storage
                .ref()
                .child(`library/books/${bookId}/${file.name}`);

            try {
                const uploadSnapshot = await storageRef.put(file);
                const downloadURL = await uploadSnapshot.ref.getDownloadURL();

                await bookRef.set({
                    title,
                    description: descriptionValue,
                    category,
                    uid: auth.currentUser.uid,
                    fileName: file.name,
                    downloadURL,
                    storagePath: storageRef.fullPath,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
            } catch (error) {
                console.error("Не вдалося опублікувати матеріал:", error);
                alert("Не вдалося завантажити матеріал. Перевір підключення та правила Firebase." + error.message);
                return;
            }

            console.log(
                "Матеріал опубліковано:",
                {
                    bookId,
                    title,
                    description: descriptionValue,
                    category,
                    fileName: file.name,
                    fileSize: file.size
                }
            );


            alert("Матеріал успішно опубліковано.");

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
const sections = document.querySelectorAll("#library, #categories, #saved");
const navLinks = document.querySelectorAll(".mobile-nav a");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
            link.classList.remove("active");
        });

        const link = document.querySelector(
            `.mobile-nav a[href="#${entry.target.id}"]`
        );

        if (link) {
            link.classList.add("active");
        }

    });

}, {
    root: null,
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0
});
function updateUI(user) {
    if (user) {
        currentUser = user.uid;
        document.getElementById("logoutButton")
            ?.style.setProperty("display", "flex");
        document.getElementById("loginButton")
            ?.style.setProperty("display", "none");
    } else {
        currentUser = null;
        document.getElementById("logoutButton")
            ?.style.setProperty("display", "none");
        document.getElementById("loginButton")
            ?.style.setProperty("display", "flex");
    }
}
auth.onAuthStateChanged((user) => {
    updateUI(user);
});
sections.forEach(section => observer.observe(section));