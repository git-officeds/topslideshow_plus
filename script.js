'use strict';

// 要素取得
const topslideshow = document.querySelector('.topslideshow');
const slides = topslideshow.querySelectorAll('.slides');
const prevButton = topslideshow.querySelector('.handler .prev');
const nextButton = topslideshow.querySelector('.handler .next');
const dots = topslideshow.querySelectorAll('.indicator .dot');

const AUTO_PLAY_INTERVAL = 5000; // 自動切替の間隔（ミリ秒）
let currentIndex = 0; // 現在表示中のスライド番号
let timer = null; // 自動切替用タイマーID

// 指定インデックスのスライドを表示し、インジケーターと連動させる
function showSlide(index) {
    slides[currentIndex].classList.remove('show');
    dots[currentIndex].classList.remove('active');

    // マイナス値や範囲外の値でも先頭・末尾に循環させる
    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('show');
    dots[currentIndex].classList.add('active');
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

// 自動切替を開始
function startAutoPlay() {
    timer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
}

// 手動操作があった際に自動切替のカウントをリセット
function resetAutoPlay() {
    clearInterval(timer);
    startAutoPlay();
}

// 次へボタン
nextButton.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
});

// 前へボタン
prevButton.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

// インジケーター（各ドット）クリックで該当スライドへジャンプ
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoPlay();
    });
});

// フリック（スワイプ）操作でのスライド切替
const FLICK_THRESHOLD = 50; // フリックと判定する最小移動距離（px）
let touchStartX = 0;
let touchEndX = 0;

topslideshow.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

topslideshow.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;

    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) < FLICK_THRESHOLD) return; // 閾値未満は誤操作とみなし無視

    if (diff < 0) {
        nextSlide(); // 左にフリック → 次のスライド
    } else {
        prevSlide(); // 右にフリック → 前のスライド
    }
    resetAutoPlay();
});

// 初期表示時に自動切替を開始
startAutoPlay();
