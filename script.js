// ==============================================================
// SISTEMA DE CARRUSEL DINÁMICO
// ==============================================================

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track) return;

    let currentIndex = 0;

    // Obtiene todas las secciones actuales dentro del carrusel dinámicamente
    const getSlides = () => track.querySelectorAll('section');

    // Función principal para mover el carrusel a una diapositiva específica
    function goToSlide(index) {
        const slides = getSlides();
        const totalSlides = slides.length;

        if (totalSlides === 0) return;

        // Soporte de ciclo continuo (loop)
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // Desplazamiento horizontal suave
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Botones de flechas (Anterior y Siguiente)
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }

    // Navegación con el teclado (flechas izquierda y derecha)
    document.addEventListener('keydown', (e) => {
        // Si se está escribiendo dentro de un campo de texto o textarea, no cambiar de diapositiva
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return;
        }

        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });

    // Soporte táctil para deslizar con el dedo (swipe en móviles / tablets)
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        if (e.target.closest('.globo-texto')) return;
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (e.target.closest('.globo-texto')) return;
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;

        // Umbral de 50px para activar el deslizamiento
        if (diffX > 50) {
            goToSlide(currentIndex + 1); // Deslizar a la izquierda -> siguiente
        } else if (diffX < -50) {
            goToSlide(currentIndex - 1); // Deslizar a la derecha -> anterior
        }
    }, { passive: true });

    // Inicializar carrusel en la primera diapositiva (Carta)
    goToSlide(0);

    // ==============================================================
    // GLOBOS DE TEXTO EMERGENTES EN LA SECCIÓN DE RECUERDOS
    // ==============================================================
    const fotosRecuerdos = document.querySelectorAll('.foto-recuerdo');

    fotosRecuerdos.forEach((recuerdo) => {
        const wrapper = recuerdo.querySelector('.foto-wrapper');
        const globo = recuerdo.querySelector('.globo-texto');
        const cerrarBtn = recuerdo.querySelector('.globo-cerrar');

        // Al hacer click en la foto: alternar ventana emergente
        if (wrapper) {
            wrapper.addEventListener('click', (e) => {
                // Si el click fue dentro del globo, no hacer nada
                if (globo && globo.contains(e.target)) return;

                const yaActivo = recuerdo.classList.contains('activo');

                // Cerrar cualquier otro globo abierto
                fotosRecuerdos.forEach((r) => {
                    if (r !== recuerdo) r.classList.remove('activo');
                });

                // Si no estaba activo, lo abrimos; si ya lo estaba, lo cerramos
                if (!yaActivo) {
                    recuerdo.classList.add('activo');
                } else {
                    recuerdo.classList.remove('activo');
                }
            });
        }

        // Botón de cerrar (x) dentro del globo
        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                recuerdo.classList.remove('activo');
            });
        }
    });

    // Cerrar los globos abiertos al hacer click en cualquier parte fuera de las fotos
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.foto-recuerdo')) {
            fotosRecuerdos.forEach((r) => r.classList.remove('activo'));
        }
    });
});
