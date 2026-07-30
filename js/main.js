// Yifang Architecture - Main Script
'use strict';

// ---- Netlify Identity ----
if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', function(user) {
        if (!user) {
            window.netlifyIdentity.on('login', function() {
                document.location.href = '/admin/';
            });
        }
    });
}

// ---- Mobile menu ----
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });
}

document.querySelectorAll('.main-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
        mainNav.classList.remove('open');
    });
});

// ---- Header scroll effect ----
var header = document.querySelector('.site-header');

window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// ---- Active nav link ----
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.main-nav a');

function updateActiveNav() {
    var current = '';
    sections.forEach(function(section) {
        var top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ---- Load data from JSON ----
var defaultProjects = [
    { number: '01', title: '水岸艺术中心', type: '文化建筑', desc: '毗邻湖面的当代艺术空间，以连续坡道串联展厅与景观，让建筑成为地景的延伸。' },
    { number: '02', title: '云谷办公园区', type: '办公 / 产业园', desc: '以「垂直聚落」为概念，通过错层露台与空中连廊构建多层次交流空间。' },
    { number: '03', title: '南山住宅', type: '住宅建筑', desc: '依山而建的集合住宅，每户享有独立花园与山景视野，探索高密度下的自然居住可能。' },
    { number: '04', title: '静安旧改更新', type: '城市更新', desc: '上海里弄街区的保护性更新，在保留城市肌理的同时植入当代生活功能。' }
];

var defaultCompany = {
    intro_title: '关于异方',
    intro: '异方建筑成立于上海，是一家致力于探索空间本质的设计事务所。我们相信建筑不仅是形式的创造，更是对场地、材料与人的关系的深层回应。',
    intro_detail: '事务所的作品涵盖文化建筑、公共空间、办公及商业空间等多个领域，项目经验贯穿从概念设计到施工落地的全过程。',
    years: 15,
    projects_count: 80,
    awards_count: 25,
    address: '上海市静安区南京西路1788号',
    phone: '+86 21 6288 8800',
    email: 'studio@yifang-arc.com'
};

function loadData() {
    // Load projects
    fetch('data/projects.json')
        .then(function(r) { return r.json(); })
        .then(function(projects) {
            renderProjects(projects);
        })
        .catch(function() {
            renderProjects(defaultProjects);
        });

    // Load company info
    fetch('data/company.json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            renderCompany(data);
        })
        .catch(function() {
            renderCompany(defaultCompany);
        });
}

// ---- Render projects ----
function renderProjects(projects) {
    var grid = document.getElementById('projectGrid');
    if (!grid) return;

    var sorted = projects.slice().sort(function(a, b) {
        return (a.order || 0) - (b.order || 0);
    });

    grid.innerHTML = sorted.map(function(p, i) {
        var imgHtml = '';
        if (p.image) {
            imgHtml = '<div class=\"project-thumb\"><img src=\"' + p.image + '\" alt=\"' + p.title + '\" loading=\"lazy\"></div>';
        } else {
            imgHtml = '<div class=\"project-thumb\"><svg viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"><rect x=\"6\" y=\"8\" width=\"36\" height=\"32\" rx=\"2\"/><path d=\"M18 28l6-8 6 8\"/><path d=\"M6 26h8l10-12 8 10 10-6\"/></svg></div>';
        }

        var delay = (i + 1) * 0.05;
        return '<div class=\"project-card\" style=\"animation-delay:' + delay + 's\">' +
            '<span class=\"project-number\">' + (p.number || '0' + (i + 1)) + '</span>' +
            imgHtml +
            '<h3>' + p.title + '</h3>' +
            '<p class=\"project-type\">' + p.type + '</p>' +
            '<p class=\"project-desc\">' + p.desc + '</p>' +
            '</div>';
    }).join('');
}

// ---- Render company info ----
function renderCompany(data) {
    // Update about section
    var aboutIntro = document.querySelector('.about-intro');
    if (aboutIntro && data.intro) {
        aboutIntro.textContent = data.intro;
    }

    var aboutDetail = document.querySelector('.about-text p:not(.about-intro)');
    if (aboutDetail && data.intro_detail) {
        aboutDetail.textContent = data.intro_detail;
    }

    // Update stats
    var counters = document.querySelectorAll('.stat-number');
    if (counters.length >= 3) {
        counters[0].dataset.target = data.years || 15;
        counters[1].dataset.target = data.projects_count || 80;
        counters[2].dataset.target = data.awards_count || 25;
    }

    // Update contact info
    var contactItems = document.querySelectorAll('.contact-item');
    if (contactItems.length >= 3) {
        if (data.address) contactItems[0].querySelector('p').textContent = data.address;
        if (data.phone) contactItems[1].querySelector('p').textContent = data.phone;
        if (data.email) contactItems[2].querySelector('a').textContent = data.email;
    }
}

// ---- Stat counter animation ----
function animateCounters() {
    var counters = document.querySelectorAll('.stat-number');
    counters.forEach(function(counter) {
        var target = parseInt(counter.dataset.target) || 0;
        var increment = Math.ceil(target / 40);
        var current = 0;

        function update() {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (target >= 80 ? '+' : '');
                return;
            }
            counter.textContent = current;
            requestAnimationFrame(update);
        }
        update();
    });
}

// ---- Intersection observer for counters ----
var aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    var aboutObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutSection);
}

// ---- Scroll animation ----
var animateEls = document.querySelectorAll('.animate-in');
var animObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(function(el) { animObserver.observe(el); });

// ---- Init ----
loadData();
