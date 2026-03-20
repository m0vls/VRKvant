import { initRouter, updateEditorPreview, insertTemplate, copyEditorCode, downloadMarkdown, goBackSafe } from './router.js';
import { initSearch, openSearch, closeSearch } from './search.js';
import { initGithubAuth, publishToGitHub, uploadImage } from './github.js';

function togglePublishPanel() {
    const panel = document.getElementById('publish-panel');
    if (panel) {
        panel.classList.toggle('hidden');
        panel.classList.toggle('flex');
        if (!panel.classList.contains('hidden')) {
            updateMetaFields(); // Обновляем поля при открытии
        }
    }
}

function updateMetaFields() {
    const type = document.getElementById('meta-type').value;
    
    // Скрываем все группы по умолчанию
    document.querySelectorAll('.meta-group').forEach(el => el.classList.add('hidden'));
    
    if (type === 'lesson') {
        document.getElementById('field-track').classList.remove('hidden');
        document.getElementById('field-module').classList.remove('hidden');
        document.getElementById('field-order').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Название Урока";
    } else if (type === 'cheat') {
        document.getElementById('field-order').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Название Шпаргалки";
    } else if (type === 'project') {
        document.getElementById('field-project-desc').classList.remove('hidden');
        document.getElementById('field-project-authors').classList.remove('hidden');
        document.getElementById('field-project-tags').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Название Проекта";
    } else if (type === 'intro') {
        document.getElementById('field-track-id').classList.remove('hidden');
        document.getElementById('field-track-icon').classList.remove('hidden');
        document.getElementById('field-track-color').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Отображаемое Имя Трека";
    }
    
    autoTransliterate(); // Обновляем авто-поля при смене типа
}

const cyrillicToLatinMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'zh', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'yu',
    'я': 'ya', 'ь': '', 'ъ': ''
};

function autoTransliterate() {
    const title = document.getElementById('meta-title').value.toLowerCase();
    const type = document.getElementById('meta-type').value;
    
    let result = '';
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        if (cyrillicToLatinMap[char] !== undefined) {
            result += cyrillicToLatinMap[char];
        } else if (/[a-z0-9]/.test(char)) {
            result += char;
        } else if (char === ' ' || char === '-') {
            result += '_';
        }
    }
    
    // Убираем двойные подчеркивания
    result = result.replace(/_+/g, '_').replace(/^_|_$/g, '');
    
    if (!result) result = 'new_article';

    if (type === 'intro') {
        document.getElementById('meta-track-id').value = result;
        document.getElementById('meta-filename').value = 'intro';
    } else {
        document.getElementById('meta-filename').value = result;
    }
}

function switchPreviewMode(mode) {
    const btnArticle = document.getElementById('btn-preview-article');
    const btnCard = document.getElementById('btn-preview-card');
    const previewArticle = document.getElementById('editor-preview');
    const previewCard = document.getElementById('card-preview');
    
    if (mode === 'article') {
        btnArticle.classList.replace('text-slate-500', 'text-kvant');
        btnArticle.classList.replace('hover:text-slate-800', 'bg-white');
        btnArticle.classList.replace('dark:hover:text-white', 'dark:bg-slate-700');
        btnArticle.classList.add('shadow-sm');
        
        btnCard.classList.replace('text-kvant', 'text-slate-500');
        btnCard.classList.replace('bg-white', 'hover:text-slate-800');
        btnCard.classList.replace('dark:bg-slate-700', 'dark:hover:text-white');
        btnCard.classList.remove('shadow-sm');
        
        previewArticle.classList.remove('hidden');
        previewCard.classList.add('hidden');
        previewCard.classList.remove('flex');
    } else {
        btnCard.classList.replace('text-slate-500', 'text-kvant');
        btnCard.classList.replace('hover:text-slate-800', 'bg-white');
        btnCard.classList.replace('dark:hover:text-white', 'dark:bg-slate-700');
        btnCard.classList.add('shadow-sm');
        
        btnArticle.classList.replace('text-kvant', 'text-slate-500');
        btnArticle.classList.replace('bg-white', 'hover:text-slate-800');
        btnArticle.classList.replace('dark:bg-slate-700', 'dark:hover:text-white');
        btnArticle.classList.remove('shadow-sm');
        
        previewArticle.classList.add('hidden');
        previewCard.classList.remove('hidden');
        previewCard.classList.add('flex');
        updateCardPreview();
    }
}

function updateCardPreview() {
    const type = document.getElementById('meta-type').value;
    const container = document.getElementById('card-preview-container');
    const title = document.getElementById('meta-title').value || 'Название';
    
    if (!container) return;

    if (type === 'project') {
        const desc = document.getElementById('meta-desc').value || 'Краткое описание проекта...';
        const authors = document.getElementById('meta-authors').value || 'Иванов И.';
        const tags = document.getElementById('meta-tags').value.split(',').map(t => t.trim()).filter(t => t);
        const image = document.getElementById('meta-image').value;
        
        const tagsHtml = tags.length ? `<div class="absolute top-4 md:top-6 left-4 md:left-6 flex gap-2 flex-wrap">${tags.map(t => `<span class="bg-black/40 backdrop-blur-md text-white text-[8px] md:text-[9px] uppercase font-black px-3 py-1.5 rounded-full border border-white/20">${t}</span>`).join('')}</div>` : '';
        const imageHtml = image ? `<img src="${image}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-4xl opacity-20"><i class="fas fa-image"></i></div>`;

        container.innerHTML = `
            <div class="w-full bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 group pointer-events-none">
                <div class="h-48 md:h-60 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">${imageHtml}${tagsHtml}</div>
                <div class="p-6 md:p-8">
                    <h3 class="heading-font text-xl mb-2 md:mb-4 text-slate-800 dark:text-white">${title}</h3>
                    <p class="text-slate-500 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2">${desc}</p>
                    <div class="flex items-center text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <i class="fas fa-user-circle mr-2 text-kvant"></i> ${authors}
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'intro') {
        const iconRaw = document.getElementById('meta-icon').value || 'fas fa-gamepad';
        const color = document.getElementById('meta-color').value || 'bg-kvant';
        const isUrl = iconRaw.includes('/');
        const iconHtml = isUrl ? `<img src="${iconRaw}" class="w-12 h-12 object-contain">` : `<i class="${iconRaw} text-[3rem]"></i>`;

        container.innerHTML = `
            <div class="p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-transparent border-kvant transition-all shadow-xl flex flex-col items-center pointer-events-none">
                <div class="w-16 h-16 mb-6 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg">
                    ${iconHtml}
                </div>
                <h3 class="heading-font text-xl mb-2 w-full text-center text-slate-800 dark:text-white">${title}</h3>
                <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest text-center w-full">Новый Трек</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="text-center text-slate-400 text-xs p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 w-full">
                <i class="fas fa-info-circle text-2xl mb-3 opacity-50 block"></i>
                Превью карточки доступно только для <br><b class="text-kvant">Проектов</b> и <b class="text-kvant">Новых Треков</b>.
            </div>
        `;
    }
}

// ЭКСПОРТИРУЕМ ФУНКЦИИ СРАЗУ (до инициализации), чтобы они были доступны в HTML
window.goBackSafe = goBackSafe;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.updateEditorPreview = updateEditorPreview;
window.insertTemplate = insertTemplate;
window.copyEditorCode = copyEditorCode;
window.downloadMarkdown = downloadMarkdown;
window.updateMetaFields = updateMetaFields;
window.autoTransliterate = autoTransliterate;
window.publishToGitHub = publishToGitHub;
window.uploadImage = uploadImage;
window.switchPreviewMode = switchPreviewMode;
window.updateCardPreview = updateCardPreview;

// Инициализация роутера и других глобальных слушателей
initRouter();
initSearch();
initGithubAuth();

// Слушатель секретного сочетания клавиш (Ctrl + Shift + E)
window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyE") {
        e.preventDefault();
        window.location.hash = "editor";
    }
});

const mdInput = document.getElementById("markdown-input");
const mdPreview = document.getElementById("editor-preview");
const mdPlaceholder = document.getElementById("editor-placeholder");

if(mdInput && mdPreview) {
    mdInput.addEventListener("input", () => updateEditorPreview(mdInput, mdPreview, mdPlaceholder));
    
    // Синхронизация скролла
    mdInput.addEventListener("scroll", () => {
        const percentage = mdInput.scrollTop / (mdInput.scrollHeight - mdInput.clientHeight);
        mdPreview.scrollTop = percentage * (mdPreview.scrollHeight - mdPreview.clientHeight);
    });

    // Передаем эти элементы в функции для редактора
    window.insertTemplate = (type) => insertTemplate(mdInput, type);
    window.copyEditorCode = (event) => copyEditorCode(mdInput, event);
    window.downloadMarkdown = () => downloadMarkdown(mdInput);

    // Если мы на странице редактора, сразу обновляем превью
    if (window.location.hash === '#editor') {
        updateEditorPreview(mdInput, mdPreview, mdPlaceholder);
    }
}
