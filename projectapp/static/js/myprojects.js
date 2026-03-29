document.addEventListener('DOMContentLoaded', () => {
    
    const modal = document.getElementById('projectModal');
    const modalName = document.getElementById('modalProjectName');
    const modalDescription = document.getElementById('modalProjectDescription');
    const modalCarousel = document.getElementById('modalCarousel');
    const closeBtn = modal.querySelector('.close');
    const githubLink = document.getElementById('modalGithubLink');
    const deployLink = document.getElementById('modalDeployLink');

    let currentImageIndex = 0;
    let images = [];
    let autoRotate = null;
    let currentLang = 'es';
    let currentProject = null;

    modal.addEventListener('mouseenter', stopAutoRotate);
    modal.addEventListener('mouseleave', startAutoRotate);

    function startAutoRotate() {
        
        stopAutoRotate(); 
        autoRotate = setInterval(() => {
            if (images.length) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
            }
        }, 4000);
    }

    function stopAutoRotate() {
        
        if (autoRotate !== null) {
            clearInterval(autoRotate);
            autoRotate = null;
        }
    }

    function showImage(index) {
        const imgs = modalCarousel.querySelectorAll('img');
        imgs.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    function createNavigationButtons() {
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&#10094;';
        prevBtn.classList.add('carousel-prev');
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&#10095;';
        nextBtn.classList.add('carousel-next');
        
        modalCarousel.appendChild(prevBtn);
        modalCarousel.appendChild(nextBtn);

        prevBtn.addEventListener('click', () => {
            if (!images.length) return;
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(currentImageIndex);
        });

        nextBtn.addEventListener('click', () => {
            if (!images.length) return;
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        });
    }

    function openModal(project) {
        
        currentProject = project;
        modalName.textContent = project.name;
        modalDescription.textContent = currentProject.description[currentLang] || 'No description avilable';
        modalCarousel.innerHTML = '';

        images = project.images || [];
        currentImageIndex = 0;

        images.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = project.name;
            modalCarousel.appendChild(img);
        });

        if (images.length) {
            showImage(currentImageIndex);
            createNavigationButtons();
        }

        if (project.github_link) {
            githubLink.href = project.github_link;
            githubLink.style.display = 'inline-block';
        } else {
            githubLink.style.display = 'none';
        }

        if (project.deploy_link) {
            deployLink.href = project.deploy_link;
            deployLink.style.display = 'inline-block';
        } else {
            deployLink.style.display = 'none';
        }

        modal.style.display = 'block';

        startAutoRotate();
    }

    closeBtn.onclick = () => {
        stopAutoRotate();
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            stopAutoRotate()
            modal.style.display = 'none';
        }
    };

    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const project = {
                name: card.querySelector('.project-name').textContent,
                description: {
                    es: card.getAttribute('data-description-es'),
                    en: card.getAttribute('data-description-en'),
                },
                images: [],
                github_link: card.getAttribute('data-github') || '',
                deploy_link: card.getAttribute('data-deploy') || ''
            };

            const imagesData = card.getAttribute('data-images');
            if (imagesData) {
                try {
                    project.images = JSON.parse(imagesData);
                } catch (e) {
                    console.error('Error parsing images JSON:', e);
                }
            }
            
            currentProject = project;
            openModal(currentProject);
        });
    });

    document.getElementById('languageSelector').addEventListener('click', (event) => {
        
        if (event.target.tagName !== 'BUTTON') return;

        currentLang = event.target.getAttribute('data-lang');

        if (currentProject) {
            modalDescription.textContent = currentProject.description[currentLang] || 'No description available';
        }

        [...event.target.parentElement.children].forEach(btn => 
            btn.classList.toggle('active', btn === event.target)
        );
    });

});