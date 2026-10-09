/* ==========================================================================
   Portfolio Jules COUPRIE — ESTACA Aerodynamics & Motorsport
   Bilingual System (FR/EN) Inspired by calusaxel.github.io
   Interactive Unified Timeline & Technical Case Studies
   ========================================================================== */

let currentLang = localStorage.getItem('portfolio_lang') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    initCanvasFlow();
    initViewToggle();
    initTimelineFilters();
    initSmoothScroll();
    initLangToggle();
    updateLanguageUI();
});

/* --------------------------------------------------------------------------
   1. CFD Streamlines Particle Canvas Background
   -------------------------------------------------------------------------- */
function initCanvasFlow() {
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(60, Math.floor(width / 25));

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 100 + 50,
            speed: Math.random() * 2.5 + 1,
            color: Math.random() > 0.5 ? 'rgba(0, 168, 204, ' : 'rgba(255, 69, 0, ',
            alpha: Math.random() * 0.25 + 0.08,
            amplitude: Math.random() * 35 + 12,
            frequency: Math.random() * 0.004 + 0.0015
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.speed;
            if (p.x > width + p.length) {
                p.x = -p.length;
                p.y = Math.random() * height;
            }

            const yOffset = Math.sin(p.x * p.frequency) * p.amplitude;

            const gradient = ctx.createLinearGradient(p.x, p.y + yOffset, p.x + p.length, p.y + yOffset);
            gradient.addColorStop(0, p.color + '0)');
            gradient.addColorStop(0.5, p.color + p.alpha + ')');
            gradient.addColorStop(1, p.color + '0)');

            ctx.beginPath();
            ctx.moveTo(p.x, p.y + yOffset);
            ctx.lineTo(p.x + p.length, p.y + yOffset);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   2. Bilingual Dictionary & Language Toggle (FR / EN)
   -------------------------------------------------------------------------- */
const translations = {
    fr: {
        nav_about: "Présentation",
        nav_experience: "Parcours & Projets",
        nav_skills: "Compétences",
        nav_personal: "Personnel",
        nav_contact: "Contact",
        hero_role: "Recherche d'un stage ingénieur en Aérodynamisme & CFD",
        stat_estaca: "Cursus Ingénieur Aéronautique",
        stat_dur_val: "Césure 1 An",
        stat_duration: "À partir de Juillet 2027 (Flexible)",
        stat_loc_val: "Mobilité",
        stat_location: "France & Étranger",
        btn_contact: "Me Contacter",
        btn_cv: "Mon CV / Resume (PDF)",
        about_tag: "<i class=\"fa-solid fa-user-astronaut\"></i> Présentation",
        about_title: "Présentation",
        about_heading: "Mon Profil & Approche",
        about_p1: "Élève ingénieur en 4ᵉ année en Ingénierie Aéronautique à l'ESTACA, je suis à la recherche d'un stage de césure de 1 an en Aérodynamique & CFD dans le sport automobile et les industries de pointe, à partir de juillet 2027.",
        about_p2: "Passionné par le sport automobile, je suis captivé par cet univers exigeant où se mêlent ingénierie de pointe, esprit de compétition et recherche continue de la performance.",
        about_p3: "Rigoureux et méthodique, j'aborde les défis techniques avec une approche scientifique structurée. Je souhaite mettre ma détermination et mon sens du travail en équipe au service d'une écurie ou d'un bureau d'études ambitieux.",
        synth_title: "Fiche Synthétique",
        synth_name: "Nom :",
        synth_school: "Formation :",
        synth_school_val: "ESTACA (4ème année — Ingénierie Aéronautique)",
        synth_target: "Stage recherché :",
        synth_target_val: "Aérodynamisme & CFD (Motorsport)",
        synth_dates: "Durée & Période :",
        synth_dates_val: "Césure de 1 an, à partir de juillet 2027 (dates flexibles)",
        synth_lang: "Anglais :",
        synth_loc: "Mobilité :",
        synth_loc_val: "France & International",
        synth_cv_btn: "Consulter mon CV / Resume (PDF)",
        synth_btn: "Contact Direct (Email)",
        exp_tag: "<i class=\"fa-solid fa-timeline\"></i> Parcours",
        exp_title: "Expériences Professionnelles & Projets",
        exp_desc: "Chronologie complète de mes projets d'ingénierie et expériences professionnelles.",
        view_timeline: "<i class=\"fa-solid fa-timeline\"></i> Vue Chronologique",
        view_mosaic: "<i class=\"fa-solid fa-border-all\"></i> Vue Mosaïque",
        filter_all: "Tous les éléments",
        filter_pro: "Expériences pro",
        filter_perso_asso: "Projets associatifs & personnels",
        
        // Timeline Item 1: F1 Front Wing
        nb1_date: "<i class=\"fa-regular fa-calendar\"></i> Depuis Juin 2026",
        nb1_title: "Conception et étude CFD d'un aileron avant de F1",
        nb1_sub: "Projet d'Ingénierie F1 • Jules COUPRIE & Tom CORBETT",
        nb1_summary: "Conception CAO 3DEXPERIENCE et étude CFD (ANSYS Fluent) d'un aileron avant multi-éléments F1. Développement d'un aéro-mapping par méthode de krigeage (modèle d'interpolation et de prédictibilité) : automatisation de la chaîne de calculs CFD d'entrée, réduction drastique du coût computationnel, validation et réentraînement itératif du métamodèle. Optimisation de forme et analyse de sensibilité des paramètres clés (cambrure, incidence, front ride height, interactions multi-éléments).",
        nb1_btn: "Voir le Dossier Technique F1",

        // Timeline Item 2: Prague
        exp1_date: "<i class=\"fa-regular fa-calendar\"></i> Juillet à Août 2026",
        exp1_title: "Chercheur en Aérodynamisme",
        exp1_sub: "Université ČVUT de Prague (Laboratoire de recherche)",
        exp1_desc: "Sujet : <em>Simulation and initial design of peristaltic pump</em>. Modélisation CFD interne, couplage fluide-structure (FSI) et remaillage dynamique sous ANSYS.",
        exp1_btn: "Voir le Dossier du Stage",

        // Timeline Item 3: HYCE
        exp2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 à Présent",
        exp2_title: "Projet HYCE",
        exp2_sub: "Membre Pôle Système Embarqué & Responsable Communication",
        exp2_desc: "Projet lié à l'association iDrogen au sein de l'ESTACA visant à rétrofiter un véhicule de course avec un moteur à combustion interne hydrogène, afin de réaliser le record du tour au Nürburgring dans notre catégorie.",
        exp2_sec_line: "Également secrétaire de l'association iDrogen ESTACA : coordination des réunions et suivi des jalons de développement.",
        exp2_btn: "Voir le Dossier Technique HYCE",

        // Timeline Item 4: UCAV
        nb2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 à 2026",
        nb2_title: "Dimensionnement, conception et performances d'un UCAV",
        nb2_sub: "Projet d'École ESTACA • Intervenants Thales & Dassault Aviation",
        nb2_summary: "Dimensionnement global, modélisation CAO sous 3DEXPERIENCE et calculs de performances d'un UCAV furtif. Synthèse des leçons sur les compromis de furtivité, de centrage et d'autonomie.",
        nb2_btn: "Voir le Dossier Technique UCAV",

        // Timeline Item 5: SD Aviation
        exp4_date: "<i class=\"fa-regular fa-calendar\"></i> Juillet 2024",
        exp4_title: "Agent d'Opération & Suivi de Vol • SD Aviation",
        exp4_sub: "La Roche-sur-Yon",
        exp4_desc: "Immersion opérationnelle dans le secteur aéronautique et gestion de la conformité des avions.",
        exp4_b1: "Gestion des plannings et préparation des vols (outils spécialisés Léon et ForeFlight).",
        exp4_b2: "Création de matrices de conformité et rédaction de procédures de contrôle technique des aéronefs.",

        // Personal Section
        personal_tag: "<i class=\"fa-solid fa-compass\"></i> Personnel",
        personal_title: "Personnel",
        personal_intro_phrase: "Animé par un véritable esprit d'aventure et de compétition, je cultive la recherche constante de performance, de sang-froid et d'endurance physique à travers mes engagements.",
        per_outdoor_title: "Outdoor",
        per_outdoor_desc: "Traversée du <strong>GR20 en Corse</strong>, expéditions trekking d'altitude, pratique du <strong>Trail</strong> et d'<strong>Escalade</strong>. Un environnement exigeant qui développe l'autonomie, la gestion de l'effort et une résilience à toute épreuve.",
        per_outdoor_tag: "GR20 • Trekking • Trail • Escalade",
        per_sport_title: "Sport",
        per_sport_desc: "<strong>8 ans de Skateboard</strong> (agilité & persévérance face à l'échec), <strong>Marathonien</strong>, passionné de <strong>Sport Automobile</strong>, et en préparation active pour un <strong>Triathlon</strong>. Rigueur d'entraînement et recherche constante de performance.",
        per_sport_tag: "Skate (8 ans) • Marathon • Triathlon • Motorsport",
        per_video_title: "Vidéaste & Photographe",
        per_video_desc: "Réalisation photo et vidéo sur le terrain, captation de projets techniques et montage vidéo avancé sous <strong>DaVinci Resolve</strong>. Sens de l'image, narration visuelle et mise en valeur des accomplissements d'ingénierie.",
        per_video_tag: "Photo • Vidéo • DaVinci Resolve",

        // Skills Section
        skills_tag: "<i class=\"fa-solid fa-laptop-code\"></i> Compétences",
        skills_title: "Résumé des compétences",
        skills_desc: "Synthèse de mes compétences techniques, méthodologiques et linguistiques.",
        sk1_title: "Soft Skills",
        sk1_p1: "<i class=\"fa-solid fa-check\"></i> Management d'équipe",
        sk1_p2: "<i class=\"fa-solid fa-check\"></i> Structuration de projet",
        sk1_p3: "<i class=\"fa-solid fa-check\"></i> Gestion de deadline",
        sk1_p4: "<i class=\"fa-solid fa-check\"></i> Établissement d'un schéma de travail",
        sk2_title: "Hard Skills",
        sk2_p1: "<i class=\"fa-solid fa-check\"></i> CAO : 3DEXPERIENCE (3DX), CATIA, SolidWorks",
        sk2_p2: "<i class=\"fa-solid fa-check\"></i> CFD : Suite ANSYS (Fluent)",
        sk2_p3: "<i class=\"fa-solid fa-check\"></i> Codage Python & ParaView",
        sk2_p4: "<i class=\"fa-solid fa-check\"></i> MATLAB / SIMULINK",
        sk2_p5: "<i class=\"fa-solid fa-check\"></i> Mécanique des Fluides & Aérodynamique",
        sk3_title: "Linguistique & Compétences Annexes",
        sk3_p1: "<i class=\"fa-solid fa-check\"></i> Anglais C1 (960 au TOEIC)",
        sk3_p2: "<i class=\"fa-solid fa-check\"></i> Montage vidéo (DaVinci Resolve)",
        sk3_p3: "<i class=\"fa-solid fa-check\"></i> Développement de site web",
        sk3_p4: "<i class=\"fa-solid fa-check\"></i> Connaissance du monde aéronautique opérationnel",

        // Contact Section & Footer
        contact_tag: "<i class=\"fa-solid fa-envelope-open-text\"></i> Contact",
        contact_title: "Discutons d'une Opportunité de Stage",
        contact_desc: "Recherche active d'un stage de césure de 1 an à partir de juillet 2027 (dates flexibles). Prêt à échanger sur mes projets et ma candidature.",
        contact_direct: "Coordonnées Directes",
        c_email: "Email Professionnel",
        c_phone: "Téléphone",
        c_loc: "Localisation & Mobilité",
        c_loc_val: "Nantes / Mobilité France & International",
        lbl_name: "Nom et Prénom",
        lbl_company: "Entreprise / Écurie",
        lbl_email: "Adresse Email",
        lbl_phone: "Numéro de Téléphone <span style=\"color: var(--text-muted); font-size: 0.82rem; font-weight: normal;\">(Optionnel)</span>",
        lbl_msg: "Message",
        btn_send: "Envoyer le Message",
        footer_copy: "© 2026 Jules COUPRIE • Portfolio Ingénieur ESTACA (Aérodynamisme & CFD).",
        back_top: "Retour en haut"
    },
    en: {
        nav_about: "Overview",
        nav_experience: "Timeline & Projects",
        nav_skills: "Skills",
        nav_personal: "Personal",
        nav_contact: "Get In Touch",
        hero_role: "Seeking an Industrial Placement in Aerodynamics & CFD",
        stat_estaca: "Aeronautical Engineering",
        stat_dur_val: "1-Year Industrial Placement",
        stat_duration: "Starting July 2027 (Flexible)",
        stat_loc_val: "Mobility",
        stat_location: "France & Worldwide",
        btn_contact: "Contact Me",
        btn_cv: "My Resume (PDF)",
        about_tag: "<i class=\"fa-solid fa-user-astronaut\"></i> Overview",
        about_title: "Overview",
        about_heading: "About Me & Approach",
        about_p1: "As a Master's degree student in Aeronautical Engineering at ESTACA (4th year), I am seeking a 1-year industrial placement in Aerodynamics & CFD within motorsport and advanced engineering, starting in July 2027.",
        about_p2: "Passionate about motorsport, I am captivated by this demanding field combining cutting-edge engineering, competitive spirit, and continuous search for performance.",
        about_p3: "Rigorously methodical, I tackle technical challenges with a structured scientific approach. I aim to bring my determination and teamwork skills to an ambitious racing team or design office.",
        synth_title: "Key Details",
        synth_name: "Name:",
        synth_school: "Education:",
        synth_school_val: "ESTACA (Master's Degree in Aeronautical Engineering)",
        synth_target: "Seeking:",
        synth_target_val: "Aerodynamics & CFD (Motorsport)",
        synth_dates: "Duration & Timing:",
        synth_dates_val: "1-Year Industrial Placement, starting in July 2027 (flexible dates)",
        synth_lang: "English:",
        synth_loc: "Mobility:",
        synth_loc_val: "France & International Mobility",
        synth_cv_btn: "View My Resume (PDF)",
        synth_btn: "Direct Email Contact",
        exp_tag: "<i class=\"fa-solid fa-timeline\"></i> Timeline",
        exp_title: "Professional Experience & Projects",
        exp_desc: "Comprehensive timeline of engineering projects and work experience.",
        view_timeline: "<i class=\"fa-solid fa-timeline\"></i> Timeline View",
        view_mosaic: "<i class=\"fa-solid fa-border-all\"></i> Grid View",
        filter_all: "All Items",
        filter_pro: "Work Experience",
        filter_perso_asso: "Projects & Student Associations",

        // Timeline Item 1: F1 Front Wing (EN)
        nb1_date: "<i class=\"fa-regular fa-calendar\"></i> Since June 2026",
        nb1_title: "F1 Front Wing Design & CFD Study",
        nb1_sub: "F1 Engineering Project • Jules COUPRIE & Tom CORBETT",
        nb1_summary: "3DEXPERIENCE CAD design and ANSYS Fluent CFD study of an F1 multi-element front wing. Development of an aerodynamic mapping using Kriging surrogate modeling (interpolation & predictability): automated CFD simulation pipeline for input data, drastic reduction in computational cost, iterative validation and retraining. Aerodynamic shape optimization and sensitivity analysis across key design parameters (camber, angle of attack, front ride height, multi-element slots).",
        nb1_btn: "View F1 Technical Dossier",

        // Timeline Item 2: Prague (EN)
        exp1_date: "<i class=\"fa-regular fa-calendar\"></i> July to August 2026",
        exp1_title: "Aerodynamics Researcher Intern",
        exp1_sub: "ČVUT University of Prague (Research Laboratory)",
        exp1_desc: "Subject: <em>Simulation and initial design of peristaltic pump</em>. Internal CFD modeling, Fluid-Structure Interaction (FSI), and dynamic remeshing with ANSYS.",
        exp1_btn: "View Internship Dossier",

        // Timeline Item 3: HYCE (EN)
        exp2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 to Present",
        exp2_title: "HYCE Project",
        exp2_sub: "Embedded Systems Member & Communication Lead",
        exp2_desc: "Project associated with iDrogen ESTACA aiming to retrofit a race car with a hydrogen internal combustion engine to set the Nürburgring lap record in our category.",
        exp2_sec_line: "Also Secretary of the iDrogen ESTACA association: coordinating team meetings and tracking key development milestones.",
        exp2_btn: "View HYCE Technical Dossier",

        // Timeline Item 4: UCAV (EN)
        nb2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 to 2026",
        nb2_title: "Sizing, CAD Design & Performances of a UCAV",
        nb2_sub: "ESTACA School Project • Guest Lectures from Thales & Dassault Aviation",
        nb2_summary: "Global sizing study, 3DEXPERIENCE CAD modeling, and performance calculations for a flying-wing UCAV. Summary of lessons learned on stability, mass balance, and range trade-offs.",
        nb2_btn: "View UCAV Technical Dossier",

        // Timeline Item 5: SD Aviation (EN)
        exp4_date: "<i class=\"fa-regular fa-calendar\"></i> July 2024",
        exp4_title: "Flight Operations & Compliance • SD Aviation",
        exp4_sub: "La Roche-sur-Yon, France",
        exp4_desc: "Operational immersion in aviation operations and aircraft compliance management.",
        exp4_b1: "Flight scheduling and preparation using Léon and ForeFlight tools.",
        exp4_b2: "Creating compliance matrices and drafting aircraft technical inspection procedures.",

        // Personal Section (EN)
        personal_tag: "<i class=\"fa-solid fa-compass\"></i> Personal",
        personal_title: "Personal",
        personal_intro_phrase: "Driven by a true spirit of adventure and competition, I continuously cultivate performance, composure, and physical endurance through my personal pursuits.",
        per_outdoor_title: "Outdoor",
        per_outdoor_desc: "Traversing the <strong>GR20 in Corsica</strong>, high-altitude trekking, <strong>Trail running</strong>, and <strong>Rock Climbing</strong>. A demanding environment forging self-reliance, effort pacing, and unyielding resilience.",
        per_outdoor_tag: "GR20 • Trekking • Trail • Climbing",
        per_sport_title: "Sports",
        per_sport_desc: "<strong>8 Years of Skateboarding</strong> (agility & perseverance), <strong>Marathon Runner</strong>, passionate about <strong>Motorsport</strong>, and actively training for a <strong>Triathlon</strong>. Rigorous training discipline and drive for performance.",
        per_sport_tag: "Skate (8 yrs) • Marathon • Triathlon • Motorsport",
        per_video_title: "Videographer & Photographer",
        per_video_desc: "On-field photo and video production, technical project filming, and advanced video editing with <strong>DaVinci Resolve</strong>. Eye for imagery, visual storytelling, and highlighting engineering milestones.",
        per_video_tag: "Photo • Video • DaVinci Resolve",

        // Skills Section (EN)
        skills_tag: "<i class=\"fa-solid fa-laptop-code\"></i> Skills",
        skills_title: "Skills Summary",
        skills_desc: "Overview of technical, methodological, and linguistic competencies.",
        sk1_title: "Soft Skills",
        sk1_p1: "<i class=\"fa-solid fa-check\"></i> Team Management & Leadership",
        sk1_p2: "<i class=\"fa-solid fa-check\"></i> Project Structuring & Planning",
        sk1_p3: "<i class=\"fa-solid fa-check\"></i> Deadline & Milestone Execution",
        sk1_p4: "<i class=\"fa-solid fa-check\"></i> Workflow Design & Standard Operating Procedures",
        sk2_title: "Hard Skills",
        sk2_p1: "<i class=\"fa-solid fa-check\"></i> CAD: 3DEXPERIENCE (3DX), CATIA, SolidWorks",
        sk2_p2: "<i class=\"fa-solid fa-check\"></i> CFD: ANSYS Suite (Fluent)",
        sk2_p3: "<i class=\"fa-solid fa-check\"></i> Coding: Python & ParaView Scripting",
        sk2_p4: "<i class=\"fa-solid fa-check\"></i> MATLAB / SIMULINK",
        sk2_p5: "<i class=\"fa-solid fa-check\"></i> Fluid Mechanics & Aerodynamics",
        sk3_title: "Languages & Auxiliary Skills",
        sk3_p1: "<i class=\"fa-solid fa-check\"></i> English C1 (TOEIC 960)",
        sk3_p2: "<i class=\"fa-solid fa-check\"></i> Video Editing (DaVinci Resolve)",
        sk3_p3: "<i class=\"fa-solid fa-check\"></i> Web Design & Front-End Development",
        sk3_p4: "<i class=\"fa-solid fa-check\"></i> Operational Aviation Systems Knowledge",

        // Contact Section & Footer (EN)
        contact_tag: "<i class=\"fa-solid fa-envelope-open-text\"></i> Contact",
        contact_title: "Let's Discuss an Internship Opportunity",
        contact_desc: "Actively seeking a 1-year industrial placement starting in July 2027 (flexible dates). Ready to discuss my technical projects and application.",
        contact_direct: "Direct Contact Information",
        c_email: "Professional Email",
        c_phone: "Phone Number",
        c_loc: "Location & Mobility",
        c_loc_val: "Nantes, France / Mobile across France & Internationally",
        lbl_name: "Full Name",
        lbl_company: "Company / Team",
        lbl_email: "Email Address",
        lbl_phone: "Phone Number <span style=\"color: var(--text-muted); font-size: 0.82rem; font-weight: normal;\">(Optional)</span>",
        lbl_msg: "Message",
        btn_send: "Send Message",
        footer_copy: "© 2026 Jules COUPRIE • ESTACA Engineering Portfolio (Aerodynamics & CFD).",
        back_top: "Back to top"
    }
};

function initLangToggle() {
    const langBtn = document.getElementById('lang-toggle');
    if (!langBtn) return;

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        localStorage.setItem('portfolio_lang', currentLang);
        updateLanguageUI();
    });
}

function updateLanguageUI() {
    document.documentElement.lang = currentLang;

    const opts = document.querySelectorAll('.lang-opt');
    opts.forEach(opt => {
        if (opt.getAttribute('data-lang') === currentLang) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    const dict = translations[currentLang];
    if (dict) {
        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            if (dict[key]) {
                elem.innerHTML = dict[key];
            }
        });
    }
}

/* --------------------------------------------------------------------------
   3. View Toggle (Chronologique vs Mosaïque)
   -------------------------------------------------------------------------- */
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const viewMode = btn.getAttribute('data-view');
            if (viewMode === 'mosaic') {
                timelineContainer.classList.add('view-mosaic');
            } else {
                timelineContainer.classList.remove('view-mosaic');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. Timeline Filtering Logic (Fix Alignment Bugs on Filter)
   -------------------------------------------------------------------------- */
function initTimelineFilters() {
    const filterBtns = document.querySelectorAll('.timeline-filters .filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function applyFilter(filter) {
        let visibleIndex = 0;

        timelineItems.forEach(item => {
            const categories = item.getAttribute('data-category').split(' ');

            if (filter === 'all' || categories.includes(filter)) {
                item.style.display = 'block';
                
                item.classList.remove('visible-left', 'visible-right');
                if (visibleIndex % 2 === 0) {
                    item.classList.add('visible-left');
                } else {
                    item.classList.add('visible-right');
                }
                visibleIndex++;

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    item.style.display = 'none';
                    item.classList.remove('visible-left', 'visible-right');
                }, 250);
            }
        });
    }

    applyFilter('all');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            applyFilter(filter);
        });
    });
}

/* --------------------------------------------------------------------------
   5. Engineering Notebook Modals Data & Logic
   -------------------------------------------------------------------------- */
const notebooksData = {
    1: {
        fr: {
            title: "Conception et étude CFD d'un aileron avant de F1",
            subtitle: "Projet d'Ingénierie Aérodynamique en Duo (Jules COUPRIE & Tom CORBETT)",
            badgeTag: "DOSSIER TECHNIQUE AILERON AVANT F1",
            isCustomF1Layout: true,
            
            generalPres: "Projet d'ingénierie aérodynamique mené en collaboration avec Tom CORBETT (élève ingénieur ESTACA, expérience chez Williams F1 Racing).",

            mentorsText: "Projet développé sous l'encadrement technique de Louis GUIDET (Aérodynamicien chez Alpine F1) et avec le soutien de professeurs experts de l'ONERA (Office National d'Études et de Recherches Aéronautiques).",

            objectivesBullets: [
                "Comprendre en profondeur les phénomènes aérodynamiques complexes (CFD) appliqués à un aileron avant multi-éléments de Formule 1.",
                "Développer un aéro-mapping complet via un métamodèle de substitution par krigeage (Gaussian Process Regression) pour interpoler et prédire les performances.",
                "Automatiser la chaîne de calculs (CAO 3DX paramétrique, maillage automatisé et simulations d'entrée sous ANSYS Fluent) pour alimenter le modèle d'interpolation de manière autonome.",
                "Valider les prédictions du métamodèle face à des calculs de contrôle et réentraîner itérativement la méthode pour converger vers des géométries optimisées.",
                "Quantifier l'impact et la sensibilité relative des paramètres clés étudiés (cambrure, angle d'incidence, front ride height, interactions multi-éléments).",
                "Assimiler la démarche scientifique, la structuration de projet et les contraintes réglementaires FIA appliquées en écurie de Formule 1."
            ],

            aeroMappingPres: "Afin d'explorer un espace de conception géométrique et aérodynamique vaste sans subir le coût prohibitif de centaines de calculs CFD complets, nous mettons en place un aéro-mapping basé sur une méthode de krigeage. Ce métamodèle d'interpolation spatiale et de prédictibilité permet d'évaluer le comportement aérodynamique global tout en réduisant de manière conséquente le nombre de simulations Navier-Stokes requises.",

            aeroMappingBullets: [
                "Réduction drastique du coût computationnel : le modèle de krigeage permet d'interpoler et de prédire précisément les coefficients aérodynamiques (Cz, Cx, finesse, Cpt) sur l'ensemble de l'enveloppe à partir d'un échantillonnage de simulations d'entrée restreint et optimisé (Plan d'Expériences).",
                "Automatisation de la chaîne de calculs : développement d'un pipeline automatisé reliant la génération de géométrie paramétrique sous 3DEXPERIENCE, le maillage et le lancement autonome des simulations CFD sous ANSYS Fluent pour alimenter la base de données d'apprentissage.",
                "Validation et réentraînement itératif : validation croisée systématique des résultats du modèle face à des calculs CFD de vérification, puis réentraînement ciblé de la méthode dans les zones à fort gradient pour maximiser la fidélité prédictive.",
                "Optimisation de forme et analyse de sensibilité : exploitation de l'aéro-map pour synthétiser des formes d'aileron optimisées et isoler avec précision l'influence de chaque variable clé (cambrure des profils, angle d'incidence, hauteur avant / front ride height / effet de sol, fentes et décalages multi-éléments)."
            ],

            metricsBullets: [
                "Finesse aérodynamique globale : optimisation continue du compromis entre coefficient de traînée Cx et coefficient de portance/appui Cz sur l'ensemble du domaine d'assiette.",
                "Sensibilité à la hauteur de caisse avant (Front Ride Height) : cartographie de l'effet de sol, des gradients d'appui et du risque de décollement à faible garde au sol.",
                "Coefficient de pression totale Cpt (mesuré à 1 mètre en aval) : caractérisation des pertes de charge et de l'énergie cinétique restante de l'écoulement.",
                "Position du sillage sur l'axe latéral (Y) : optimisation de l'endplate afin de maximiser l'effet d'outwash et de dévier le flux d'air perturbé en dehors de la roue avant."
            ],

            skillsAndTools: [
                "Aéro-mapping & Méthode de krigeage : interpolation spatiale, régression par processus gaussiens et métamodèles prédictifs.",
                "Automatisation & Scripting : automatisation de la chaîne numérique CAO-CFD et traitement de données.",
                "3DEXPERIENCE (3DX) : modélisation surfacique paramétrique (Generative Shape Design) de l'aileron complet.",
                "Suite ANSYS (Fluent) : maillage et solveurs CFD haute fidélité pour la simulation numérique des écoulements fluides.",
                "Structuration de projet F1 & Réglementation FIA : méthodologie d'ingénierie appliquée en écurie et respect du cadre réglementaire technique."
            ],

            pdfLinkText: "📄 Consulter la Présentation Technique F1 (PDF)",
            pdfLinkUrl: "assets/portfolio_f1.pdf"
        },
        en: {
            title: "F1 Front Wing Design & CFD Study",
            subtitle: "Aerodynamic Engineering Duo Project (Jules COUPRIE & Tom CORBETT)",
            badgeTag: "F1 FRONT WING TECHNICAL DOSSIER",
            isCustomF1Layout: true,
            
            generalPres: "Aerodynamic engineering project conducted in collaboration with Tom CORBETT (ESTACA engineering student, experience at Williams F1 Racing).",

            mentorsText: "Project conducted under the technical guidance of Louis GUIDET (Aerodynamicist at Alpine F1) and supported by expert professors from ONERA (French National Aerospace Research Center).",

            objectivesBullets: [
                "Gain deep insight into complex aerodynamic CFD phenomena applied to a multi-element Formula 1 front wing.",
                "Develop an aerodynamic mapping based on Kriging surrogate modeling (Gaussian Process Regression) for interpolation and predictive analysis.",
                "Automate the simulation workflow (parametric 3DX CAD, automated meshing, and batch CFD solver runs in ANSYS Fluent) to autonomously generate input training data.",
                "Validate surrogate model predictions against high-fidelity CFD simulations and iteratively retrain the algorithm to converge on optimized wing geometries.",
                "Quantify the aerodynamic sensitivity and precise influence of key design variables (camber distribution, angle of attack, front ride height, multi-element slots).",
                "Master professional engineering workflows, F1 project structuring, and FIA regulatory compliance applied in race team design offices."
            ],

            aeroMappingPres: "To explore an extensive multi-parameter design envelope without incurring the prohibitive computational cost of hundreds of full Navier-Stokes CFD simulations, we develop an aerodynamic mapping based on Kriging. This spatial interpolation and surrogate modeling method accurately predicts global aerodynamic behavior while substantially reducing the total number of simulations required.",

            aeroMappingBullets: [
                "Drastic computational cost reduction: Kriging accurately interpolates and predicts aerodynamic responses (Cz, Cx, L/D efficiency, total pressure loss Cpt) across the entire continuous parameter space from an optimized, compact set of training CFD simulations (Design of Experiments).",
                "Simulation pipeline automation: scripted workflow coupling parametric 3D CAD modeling in 3DEXPERIENCE, automated meshing, and autonomous batch CFD solver runs in ANSYS Fluent to generate training datasets.",
                "Model validation and iterative retraining: systematic benchmarking of surrogate predictions against CFD check-points, with adaptive retraining in steep-gradient flow regimes to guarantee high surrogate accuracy.",
                "Shape optimization & sensitivity analysis: leveraging the aero map to synthesize optimized wing configurations and isolate the exact physical effect of each parameter (profile camber, angle of attack, front ride height / ground clearance, multi-element slot gap and overlap)."
            ],

            metricsBullets: [
                "Overall Aerodynamic Efficiency (L/D): continuous optimization of the trade-off between drag coefficient Cx and downforce coefficient Cz across the complete aero map.",
                "Front Ride Height Sensitivity: mapping ground-effect dynamics, downforce variations, and stall margins across operational ride heights.",
                "Total Pressure Coefficient Cpt (measured 1 m downstream): tracking pressure losses and residual kinetic energy in the airflow.",
                "Lateral wake trajectory (Y-axis): optimizing endplate geometry to deflect turbulent dirty air away from the front tires (outwash effect)."
            ],

            skillsAndTools: [
                "Aero Mapping & Kriging Method: Gaussian process regression, spatial interpolation, and predictive surrogate modeling.",
                "Pipeline Automation & Scripting: automated CAD-to-CFD computational workflows and data post-processing.",
                "3DEXPERIENCE (3DX): parametric surface CAD modeling (Generative Shape Design) of the multi-element wing assembly.",
                "ANSYS Suite (Fluent): advanced CFD meshing and high-fidelity solvers for aerodynamic simulation.",
                "Formula 1 Project Structuring & FIA Regulations: motorsport design office workflows and technical regulatory compliance."
            ],

            pdfLinkText: "📄 View F1 Technical Presentation (PDF)",
            pdfLinkUrl: "assets/portfolio_f1.pdf"
        }
    },
    2: {
        fr: {
            title: "Dimensionnement, conception et performances d'un UCAV",
            subtitle: "Projet d'École ESTACA • Cours \"Architecture Aéronautique & Performances\" (2025 à 2026)",
            badgeTag: "DOSSIER AÉRONAUTIQUE UCAV",
            isCustomUCAVLayout: true,
            
            globalWorkBullets: [
                "<strong>Conception & CAO 3DEXPERIENCE</strong> : Modélisation 3D de la cellule aile volante sous <strong>3DEXPERIENCE (3DX)</strong>.",
                "<strong>Intégration Systèmes</strong> : Emplacement de la soute d'armement au foyer des masses et motorisation dorsale (General Electric F110).",
                "<strong>Calculs de Performances</strong> : Polaires subsoniques analytiques à Mach 0.8, autonomie (formule de Breguet-Leduc) et évaluation des virages."
            ],

            lessonsAndConclusionsBullets: [
                "<strong>Furtivité vs Stabilité</strong> : L'absence d'empennage réduit la signature radar mais exige un contrôle par élevons en W.",
                "<strong>Gestion du Centrage</strong> : Aligner la soute au centre de gravité garantit une marge statique positive (+0.45%) constante lors du largage des munitions.",
                "<strong>Intégration Propulsive</strong> : L'entrée d'air dorsale préserve la furtivité au sol mais demande de surveiller le masquage à forte incidence.",
                "<strong>Rigueur d'Ingénierie</strong> : Projet de dimensionnement mené avec l'encadrement d'ingénieurs venus de <strong>Thales</strong> et <strong>Dassault Aviation</strong>."
            ],

            softwareList: [
                "3DEXPERIENCE (3DX)",
                "Calculs analytiques de performances (Breguet-Leduc & Polaires subsoniques)"
            ],

            pdfArchText: "📄 Rapport UCAV • Partie Architecture (PDF)",
            pdfArchUrl: "assets/rapport_ucav_architecture.pdf",
            pdfPerfoText: "📄 Rapport UCAV • Partie Performances (PDF)",
            pdfPerfoUrl: "assets/rapport_ucav_performances.pdf"
        },
        en: {
            title: "Sizing, CAD Design & Performances of a UCAV",
            subtitle: "ESTACA School Project • \"Aeronautical Architecture & Performance\" (2025 to 2026)",
            badgeTag: "UCAV AEROSPACE DOSSIER",
            isCustomUCAVLayout: true,
            
            globalWorkBullets: [
                "<strong>3DEXPERIENCE CAD Modeling</strong>: Flying-wing 3D design in <strong>3DEXPERIENCE (3DX)</strong> without vertical tail.",
                "<strong>Systems Integration</strong>: Internal weapon bay placement at mass center and twin dorsal GE F110 engines setup.",
                "<strong>Analytical Performance Sizing</strong>: Subsonic analytical polars at Mach 0.8, Breguet-Leduc range estimation, and dry thrust turn margin evaluation."
            ],

            lessonsAndConclusionsBullets: [
                "<strong>Stealth vs Stability</strong>: Removing vertical tail reduces radar signature but requires W-elevon flight control.",
                "<strong>Mass Centering</strong>: Aligning weapon bay at mass center maintains positive static margin (+0.45%) during weapon release.",
                "<strong>Propulsion Integration</strong>: Dorsal intake shields ground thermal signature but requires AOA airflow monitoring.",
                "<strong>Engineering Methodology</strong>: Sizing project mentored by engineers from <strong>Thales</strong> and <strong>Dassault Aviation</strong>."
            ],

            softwareList: [
                "3DEXPERIENCE (3DX)",
                "Analytical Flight Performance Analysis"
            ],

            pdfArchText: "📄 UCAV Report • Architecture Section (PDF)",
            pdfArchUrl: "assets/rapport_ucav_architecture.pdf",
            pdfPerfoText: "📄 UCAV Report • Performance Section (PDF)",
            pdfPerfoUrl: "assets/rapport_ucav_performances.pdf"
        }
    },
    3: {
        fr: {
            title: "Projet HYCE • Record du tour Nürburgring H2",
            subtitle: "Association iDrogen ESTACA • Rétrofit Moteur à Combustion Hydrogène",
            badgeTag: "PROJET HYCE — IDROGEN ESTACA",
            isDualRoleHYCE: true,
            subjectText: "Projet lié à l'association iDrogen au sein de l'ESTACA visant à rétrofiter un véhicule de course avec un moteur à combustion interne hydrogène, afin de réaliser le record du tour au Nürburgring dans notre catégorie.",
            
            role1Title: "Responsable Communication",
            role1Desc: "Management et pilotage complet de l'image de marque du projet, création de contenus numériques et développement de la communauté.",
            role1Bullets: [
                "Management d'Équipe : Encadrement et coordination d'une équipe de <strong>4 personnes</strong>.",
                "Gestion de Projet & Deadlines : Définition des objectifs stratégiques, gestion des plannings de publication et respect strict des échéances fixées.",
                "Conception & Développement Web : Réalisation intégrale du site web officiel du projet (<a href=\"https://projet-hyce.com\" target=\"_blank\" style=\"color: var(--accent-cyan); text-decoration: underline;\">projet-hyce.com</a>).",
                "Production Vidéo & Contenus : Réalisation et montage de multiples vidéos techniques diffusées sur les réseaux sociaux.",
                "Relations Publiques & Partenaires : Échanges réguliers avec les partenaires et acteurs clés du secteur pour représenter et promouvoir notre projet hydrogène."
            ],
            role1Skills: [
                "Management d'équipe (4 personnes) & Leadership",
                "Gestion de projet, objectifs & respect des deadlines",
                "Stratégie de communication digitale & Branding",
                "Développement Web Front-End (projet-hyce.com)",
                "Montage vidéo & Relations partenaires"
            ],

            role2Title: "Membre du Pôle Systèmes Embarqués",
            role2Desc: "Ingénierie de sécurité embarquée et modélisation système de l'acheminement hydrogène (Rapport PITA 3A).",
            role2Bullets: [
                "Modélisation MATLAB / SIMULINK & Simscape : Conception de l'architecture système complète sous SIMULINK en exploitant la bibliothèque <strong>Simscape Fluids</strong>.",
                "Sécurité & Conformité Réglementaire FIA : Étude approfondie et application de l'<strong>Article 266 du règlement FIA</strong> encadrant les véhicules de compétition hydrogène.",
                "Modélisation des Composants Sécurité H2 : Modélisation des réservoirs hydrogène 700 bars, vannes d'arrêt automatique/manuelle, soupape de décharge (Pressure Relief Valve), TPRD et détendeur 3 bars.",
                "Architecture Capteurs & Dashboard Pilote : Intégration des capteurs de concentration H2 (Baie moteur 0.75%/1%, Habitacle 0.3%/0.4%, Échappement 3%/4%), pression et température couplés à un Dashboard d'alerte (Warning & Shutdown)."
            ],
            role2Skills: [
                "Maîtrise MATLAB / SIMULINK & Bibliothèque Simscape Fluids",
                "Ingénierie de sécurité hydrogène haute pression (700 bar / 3 bar)",
                "Conformité réglementaire FIA Article 266 (Véhicules Hydrogène)",
                "Modélisation de capteurs/actionneurs & Dashboard d'alerte"
            ],

            pdfLinkText: "📄 Consulter le Rapport Systèmes Embarqués PITA 3A (PDF)",
            pdfLinkUrl: "assets/dossier_technique_hyce.pdf",

            softwareList: [
                "MATLAB / SIMULINK (Simscape Fluids)",
                "SolidWorks 3D CAD",
                "STM32 (Carte embarquée)",
                "HTML5 / CSS3 / JS (projet-hyce.com)"
            ]
        },
        en: {
            title: "HYCE Project • Nürburgring H2 Lap Record",
            subtitle: "iDrogen ESTACA Association • Hydrogen Combustion Race Car Retrofit",
            badgeTag: "HYCE PROJECT — IDROGEN ESTACA",
            isDualRoleHYCE: true,
            subjectText: "Project associated with iDrogen ESTACA aiming to retrofit a race car with a hydrogen internal combustion engine to set the Nürburgring lap record in our category.",
            
            role1Title: "Communication Lead",
            role1Desc: "Team management and full control of project branding, digital content, and community outreach.",
            role1Bullets: [
                "Team Management: Leading and coordinating a team of <strong>4 members</strong>.",
                "Project Management & Deadlines: Strategic goal definition, publication scheduling, and strict milestone tracking.",
                "Web Design & Development: Full creation of the official project website (<a href=\"https://projet-hyce.com\" target=\"_blank\" style=\"color: var(--accent-cyan); text-decoration: underline;\">projet-hyce.com</a>).",
                "Video & Media Production: Directing and editing technical videos shared across social channels.",
                "Public & Sponsor Relations: Continuous interaction with key industry partners and stakeholders."
            ],
            role1Skills: [
                "Team management (4 members) & Leadership",
                "Project management & deadline execution",
                "Digital communication strategy & branding",
                "Front-end Web development (projet-hyce.com)",
                "Video editing & partner relations"
            ],

            role2Title: "Embedded Systems Team Member",
            role2Desc: "Embedded safety engineering and system modeling of hydrogen delivery (PITA 3A Report).",
            role2Bullets: [
                "MATLAB / SIMULINK & Simscape Modeling: System architecture design under SIMULINK using the <strong>Simscape Fluids</strong> library.",
                "FIA Regulatory Safety Compliance: In-depth study and implementation of <strong>FIA Regulation Article 266</strong> for hydrogen race vehicles.",
                "H2 Safety Component Modeling: Modeling 700 bar tanks, automatic/manual shut-off valves, pressure relief valves, TPRD, and 3 bar regulator.",
                "Sensor Architecture & Driver Dashboard: Integrating H2 concentration sensors (Engine bay 0.75%/1%, Cockpit 0.3%/0.4%, Exhaust 3%/4%), pressure and temperature sensors linked to a Warning & Shutdown driver dashboard."
            ],
            role2Skills: [
                "MATLAB / SIMULINK & Simscape Fluids modeling",
                "High-pressure hydrogen safety engineering (700 bar / 3 bar)",
                "FIA Article 266 regulatory compliance (Hydrogen Race Cars)",
                "Sensors/Actuators modeling & Alert Dashboard logic"
            ],

            pdfLinkText: "📄 View PITA 3A Embedded Systems Report (PDF)",
            pdfLinkUrl: "assets/dossier_technique_hyce.pdf",

            softwareList: [
                "MATLAB / SIMULINK (Simscape Fluids)",
                "SolidWorks 3D CAD",
                "STM32 (Microcontroller)",
                "HTML5 / CSS3 / JS (projet-hyce.com)"
            ]
        }
    },
    4: {
        fr: {
            title: "Stage Chercheur : Simulation CFD d'une Pompe Péristaltique",
            subtitle: "Université ČVUT de Prague (Laboratoire de Recherche, Juillet à Août 2026)",
            badgeTag: "STAGE CHERCHEUR ČVUT PRAGUE",
            ndaNote: "Note de Confidentialité : Travail soumis à un accord de confidentialité (NDA) signé avec l'entreprise partenaire.",
            subjectText: "Sujet de recherche : <em>Simulation and initial design of peristaltic pump</em>. Modélisation 3D CAO, analyse CFD d'écoulements internes et simulation couplée fluide-structure (FSI) d'une pompe péristaltique sous la suite ANSYS.",
            
            skillsCFD: [
                "CFD Interne & Maillage Dynamique : Maîtrise des techniques de remaillage automatique (Dynamic Meshes & Remeshing) pour suivre les déformations géométriques de la conduite sous la pression des galets.",
                "Qualité & Précision du Maillage : Application rigoureuse des critères de qualité du maillage.",
                "Optimisation du Maillage : Ajustement stratégique de la densité du maillage pour concilier précision physique et gain significatif en temps de calcul."
            ],
            skillsGeneral: [
                "Modélisation 3D CAO (CAD) : Conception géométrique initiale de la pompe péristaltique.",
                "Programmation Python : Codage sous PyCharm pour le post-traitement.",
                "Communication & Présentation Orale : Préparation et soutenance technique en anglais devant un jury de doctorants et maîtres de stage."
            ],

            softwareList: [
                "ANSYS Fluent (Solveur CFD)",
                "ANSYS Mechanical & System Coupling (FSI — Couplage Fluide-Structure)",
                "ParaView (Post-traitement des écoulements)",
                "PyCharm (Post-traitement Python)"
            ],

            others: {
                difficulties: "Problématiques complexes de maillage (meshing) et de convergence des calculs générées par les déformations importantes des matériaux lors des simulations multidomaines (FSI).",
                visits: "Visites guidées des centres de recherche aéronautique et spatiale de Prague, ainsi que des bancs d'essai de turbopropulseurs et turboréacteurs (applications militaires et commerciales)."
            },

            photoGallery: false
        },
        en: {
            title: "Research Intern: CFD Simulation of Peristaltic Pump",
            subtitle: "ČVUT University of Prague (Research Laboratory, July to August 2026)",
            badgeTag: "RESEARCH INTERNSHIP ČVUT PRAGUE",
            ndaNote: "Confidentiality Notice: Work subject to a Non-Disclosure Agreement (NDA) signed with the corporate partner.",
            subjectText: "Research Topic: <em>Simulation and initial design of peristaltic pump</em>. 3D CAD modeling, internal CFD flow analysis, and Fluid-Structure Interaction (FSI) simulations using the ANSYS Suite.",
            
            skillsCFD: [
                "Internal CFD & Dynamic Meshing: Automated remeshing algorithms (Dynamic Meshes & Remeshing) tracking hose wall squeeze deformations.",
                "Mesh Quality & Accuracy: Strict adherence to mesh quality criteria.",
                "Mesh Optimization: Strategic mesh density adjustment balancing physical fidelity with CPU time savings."
            ],
            skillsGeneral: [
                "3D CAD Modeling: Initial geometric design (CAD) of the peristaltic pump.",
                "Python Scripting: Post-processing code developed in PyCharm.",
                "Oral Defense: Final technical presentation delivered in English before PhD researchers and advisors."
            ],

            softwareList: [
                "ANSYS Fluent (CFD Solver)",
                "ANSYS Mechanical & System Coupling (FSI — Fluid-Structure Interaction)",
                "ParaView (Flow Post-processing)",
                "PyCharm (Python Post-processing)"
            ],

            others: {
                difficulties: "Complex meshing issues and solver convergence challenges caused by severe material deformations during FSI simulations.",
                visits: "Guided tours of Prague aerospace and space research centers, as well as turboprop & turbojet engine test rigs (military & commercial applications)."
            },

            photoGallery: false
        }
    }
};

function openProjectModal(id) {
    const raw = notebooksData[id];
    if (!raw) return;
    const data = raw[currentLang] || raw['fr'];

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    // Special layout for F1 Front Wing Modal (ID 1)
    if (data.isCustomF1Layout) {
        modalBody.innerHTML = `
            <div class="notebook-modal-container">
                <div class="notebook-header">
                    <span class="section-tag">${data.badgeTag}</span>
                    <h2 class="notebook-modal-title" style="margin-top: 0.4rem;">${data.title}</h2>
                    <p class="notebook-modal-sub">${data.subtitle}</p>
                </div>

                <div class="notebook-modal-single-flow" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.6rem;">
                    
                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Présentation générale' : 'General Overview'}</h4>
                        <p class="notebook-p">${data.generalPres}</p>
                    </div>

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Encadrement et aide' : 'Mentorship & Support'}</h4>
                        <p class="notebook-p">${data.mentorsText}</p>
                    </div>

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Objectif de ce projet' : 'Project Objectives'}</h4>
                        <ul class="notebook-ul">
                            ${data.objectivesBullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>

                    ${data.aeroMappingPres ? `
                    <div class="modal-flow-section" style="background: rgba(2, 132, 199, 0.04); border: 1.5px solid rgba(2, 132, 199, 0.25); border-radius: 10px; padding: 1.25rem;">
                        <h4 class="notebook-section-h4" style="color: var(--accent-blue); display: flex; align-items: center; gap: 8px; margin-bottom: 0.6rem;">
                            <i class="fa-solid fa-chart-line"></i> ${currentLang === 'fr' ? 'Aéro-mapping & Méthode de Krigeage' : 'Aero Mapping & Kriging Surrogate Model'}
                        </h4>
                        <p class="notebook-p" style="margin-bottom: 0.85rem;">${data.aeroMappingPres}</p>
                        <ul class="notebook-ul">
                            ${data.aeroMappingBullets.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Démarche et métriques d\'analyse' : 'Methodology & Key Metrics'}</h4>
                        <ul class="notebook-ul">
                            ${data.metricsBullets.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Compétences et logiciels visés' : 'Skills & Software Mastered'}</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.4rem;">
                            ${data.skillsAndTools.map(st => `<div class="skill-pill" style="font-size: 0.95rem;"><i class="fa-solid fa-check" style="color: var(--accent-cyan);"></i> <span>${st}</span></div>`).join('')}
                        </div>
                    </div>

                    <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 8px; padding: 1.2rem; margin-top: 0.5rem;">
                        <a href="${data.pdfLinkUrl}" target="_blank" class="btn btn-gradient" style="font-size: 0.92rem; width: 100%; justify-content: center;">
                            <i class="fa-solid fa-file-pdf"></i> ${data.pdfLinkText}
                        </a>
                    </div>

                </div>
            </div>
        `;
        modal.style.display = 'flex';
        return;
    }

    // Special layout for UCAV Project Modal (ID 2)
    if (data.isCustomUCAVLayout) {
        modalBody.innerHTML = `
            <div class="notebook-modal-container">
                <div class="notebook-header">
                    <span class="section-tag">${data.badgeTag}</span>
                    <h2 class="notebook-modal-title" style="margin-top: 0.4rem;">${data.title}</h2>
                    <p class="notebook-modal-sub">${data.subtitle}</p>
                </div>

                <!-- Modélisation 3D CAO UCAV -->
                <div style="border-radius: 12px; overflow: hidden; height: 260px; border: 1px solid var(--border-color); margin-top: 1rem; margin-bottom: 1.5rem; background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 0.5rem;">
                    <img src="assets/ucav_cad.png" alt="Architecture Surfacique CAO 3D UCAV 3DEXPERIENCE" style="width: 100%; height: 100%; object-fit: contain;">
                </div>

                <div class="notebook-modal-single-flow" style="display: flex; flex-direction: column; gap: 1.6rem;">
                    
                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Démarche & Réalisations du Projet' : 'Project Methodology & Sizing'}</h4>
                        <ul class="notebook-ul">
                            ${data.globalWorkBullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Enseignements & Conclusions d\'Ingénierie' : 'Engineering Insights & Lessons Learned'}</h4>
                        <ul class="notebook-ul">
                            ${data.lessonsAndConclusionsBullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Logiciels & Outils Utilisés' : 'Software & Tools Used'}</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.5rem;">
                            ${data.softwareList.map(sw => `<span class="skill-pill" style="font-weight: 500;"><i class="fa-solid fa-check"></i> ${sw}</span>`).join('')}
                        </div>
                    </div>

                    <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 8px; padding: 1.2rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.8rem;">
                        <strong style="color: var(--text-primary); font-family: var(--font-heading); font-size: 1.02rem; display: block; margin-bottom: 0.2rem;">
                            ${currentLang === 'fr' ? '📄 Rapports Techniques Officiels du Projet UCAV :' : '📄 Official UCAV Technical Reports:'}
                        </strong>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <a href="${data.pdfArchUrl}" target="_blank" class="btn btn-gradient" style="font-size: 0.88rem; justify-content: center; padding: 0.75rem 1rem;">
                                <i class="fa-solid fa-file-pdf"></i> ${data.pdfArchText}
                            </a>
                            <a href="${data.pdfPerfoUrl}" target="_blank" class="btn btn-outline" style="font-size: 0.88rem; justify-content: center; padding: 0.75rem 1rem; border-color: var(--accent-blue); color: var(--accent-blue);">
                                <i class="fa-solid fa-file-pdf"></i> ${data.pdfPerfoText}
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        `;
        modal.style.display = 'flex';
        return;
    }

    // Special layout for HYCE Dual Role Split Selector (ID 3)
    if (data.isDualRoleHYCE) {
        modalBody.innerHTML = `
            <div class="notebook-modal-container">
                <div class="notebook-header">
                    <span class="section-tag">${data.badgeTag}</span>
                    <h2 class="notebook-modal-title" style="margin-top: 0.4rem;">${data.title}</h2>
                    <p class="notebook-modal-sub">${data.subtitle}</p>
                </div>

                <div class="modal-photo-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; margin-bottom: 1.5rem;">
                    <div style="border-radius: 10px; overflow: hidden; height: 190px; border: 1px solid var(--border-color);">
                        <img src="assets/hyce_ansys.jpg" alt="Présentation Projet HYCE Stand Ansys" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="border-radius: 10px; overflow: hidden; height: 190px; border: 1px solid var(--border-color);">
                        <img src="assets/hyce_team.jpg" alt="Équipe Officielle Projet HYCE ESTACA" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>

                <div class="modal-flow-section" style="margin-bottom: 1.2rem;">
                    <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Présentation du Projet HYCE' : 'HYCE Project Presentation'}</h4>
                    <p class="notebook-p">${data.subjectText}</p>
                </div>

                <div class="split-role-selector">
                    <button class="role-tab-btn active" id="hyce-btn-role1" onclick="switchHyceRole('role1')">
                        <i class="fa-solid fa-bullhorn"></i> ${data.role1Title}
                    </button>
                    <button class="role-tab-btn" id="hyce-btn-role2" onclick="switchHyceRole('role2')">
                        <i class="fa-solid fa-microchip"></i> ${data.role2Title}
                    </button>
                </div>

                <div id="hyce-role1-view" class="hyce-role-view">
                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${data.role1Title}</h4>
                        <p class="notebook-p" style="margin-bottom: 0.8rem; font-weight: 500;">${data.role1Desc}</p>
                        
                        <ul class="notebook-ul" style="margin-bottom: 1.2rem;">
                            ${data.role1Bullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>

                        <h5 class="notebook-sub-h5" style="margin-top: 0.8rem;">${currentLang === 'fr' ? 'Compétences acquises en Communication :' : 'Communication Leadership Skills:'}</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.4rem;">
                            ${data.role1Skills.map(s => `<span class="skill-pill"><i class="fa-solid fa-check"></i> ${s}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div id="hyce-role2-view" class="hyce-role-view" style="display: none;">
                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${data.role2Title}</h4>
                        <p class="notebook-p" style="margin-bottom: 0.8rem; font-weight: 500;">${data.role2Desc}</p>
                        
                        <ul class="notebook-ul" style="margin-bottom: 1.2rem;">
                            ${data.role2Bullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>

                        <h5 class="notebook-sub-h5" style="margin-top: 0.8rem;">${currentLang === 'fr' ? 'Compétences acquises en Systèmes Embarqués :' : 'Embedded Systems Skills:'}</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.4rem; margin-bottom: 1.2rem;">
                            ${data.role2Skills.map(s => `<span class="skill-pill"><i class="fa-solid fa-check"></i> ${s}</span>`).join('')}
                        </div>

                        <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; margin-top: 0.8rem;">
                            <a href="${data.pdfLinkUrl}" target="_blank" class="btn btn-gradient" style="font-size: 0.88rem; width: 100%; justify-content: center;">
                                <i class="fa-solid fa-file-pdf"></i> ${data.pdfLinkText}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="hyce-support-banner">
                    <div class="hyce-support-content">
                        <div class="hyce-logo-circle">
                            <img src="assets/hyce_logo.png" alt="Logo Officiel Projet HYCE">
                        </div>
                        <div class="hyce-support-text">
                            <strong>${currentLang === 'fr' ? 'Soutenez le Projet HYCE !' : 'Support the HYCE Project!'}</strong>
                            <p>${currentLang === 'fr' ? 'N\'hésitez pas à soutenir notre projet sur nos différents réseaux ou notre site web officiel.' : 'Feel free to follow and support our hydrogen racing project on social media or our official website.'}</p>
                        </div>
                    </div>
                    <div class="hyce-support-links">
                        <a href="https://projet-hyce.com" target="_blank" class="btn btn-gradient" style="font-size: 0.85rem; padding: 0.55rem 1.1rem;">
                            <i class="fa-solid fa-globe"></i> ${currentLang === 'fr' ? 'Site Web (projet-hyce.com)' : 'Website (projet-hyce.com)'}
                        </a>
                        <a href="https://linktr.ee/projet_hyce" target="_blank" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1.1rem;">
                            <i class="fa-solid fa-link"></i> Linktree
                        </a>
                    </div>
                </div>

            </div>
        `;
        modal.style.display = 'flex';
        return;
    }

    // Default Modal Rendering for other IDs (4 - ČVUT Prague)
    const labels = currentLang === 'fr' ? {
        subject: "Sujet & Contexte du Projet",
        skillsTitle: "Compétences Acquises",
        skillsCFDSub: "Spécialisation CFD & Maillage :",
        skillsGenSub: "Compétences Générales & Ingénierie :",
        softwareTitle: "Logiciels & Outils Utilisés",
        othersTitle: "Autres",
        diffLabel: "Difficultés rencontrées :",
        visitsLabel: "Visites :"
    } : {
        subject: "Project Subject & Context",
        skillsTitle: "Gained Skills & Expertise",
        skillsCFDSub: "CFD & Meshing Specialization:",
        skillsGenSub: "General Engineering Skills:",
        softwareTitle: "Software & Technical Tools Used",
        othersTitle: "Others",
        diffLabel: "Challenges encountered:",
        visitsLabel: "Visits:"
    };

    modalBody.innerHTML = `
        <div class="notebook-modal-container">
            <div class="notebook-header">
                <span class="section-tag">${data.badgeTag}</span>
                <h2 class="notebook-modal-title" style="margin-top: 0.4rem;">${data.title}</h2>
                <p class="notebook-modal-sub">${data.subtitle}</p>
            </div>

            <div class="notebook-modal-single-flow" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.8rem;">
                
                <div class="modal-flow-section">
                    <h4 class="notebook-section-h4">${labels.subject}</h4>
                    <p class="notebook-p">${data.subjectText}</p>
                    ${data.ndaNote ? `<p class="notebook-p" style="margin-top: 0.8rem; font-size: 0.92rem; color: var(--text-muted); font-style: italic;">${data.ndaNote}</p>` : ''}
                </div>

                <div class="modal-flow-section">
                    <h4 class="notebook-section-h4">${labels.skillsTitle}</h4>
                    
                    <div style="margin-bottom: 1rem;">
                        <h5 class="notebook-sub-h5">${labels.skillsCFDSub}</h5>
                        <ul class="notebook-ul">
                            ${data.skillsCFD.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>

                    <div>
                        <h5 class="notebook-sub-h5">${labels.skillsGenSub}</h5>
                        <ul class="notebook-ul">
                            ${data.skillsGeneral.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="modal-flow-section">
                    <h4 class="notebook-section-h4">${labels.softwareTitle}</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.5rem;">
                        ${data.softwareList.map(sw => `<span class="skill-pill" style="font-weight: 500;"><i class="fa-solid fa-check"></i> ${sw}</span>`).join('')}
                    </div>
                </div>

                <div class="modal-flow-section">
                    <h4 class="notebook-section-h4">${labels.othersTitle}</h4>
                    
                    <div style="background: rgba(249, 115, 22, 0.05); border-left: 3px solid var(--accent-orange); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;">${labels.diffLabel}</strong>
                        <p class="notebook-p">${data.others.difficulties}</p>
                    </div>

                    <div style="background: rgba(0, 168, 204, 0.05); border-left: 3px solid var(--accent-cyan); padding: 1rem; border-radius: 8px;">
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;">${labels.visitsLabel}</strong>
                        <p class="notebook-p">${data.others.visits}</p>
                    </div>
                </div>

            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

function switchHyceRole(roleKey) {
    const btn1 = document.getElementById('hyce-btn-role1');
    const btn2 = document.getElementById('hyce-btn-role2');
    const view1 = document.getElementById('hyce-role1-view');
    const view2 = document.getElementById('hyce-role2-view');

    if (!btn1 || !btn2 || !view1 || !view2) return;

    if (roleKey === 'role1') {
        btn1.classList.add('active');
        btn2.classList.remove('active');
        view1.style.display = 'block';
        view2.style.display = 'none';
    } else {
        btn2.classList.add('active');
        btn1.classList.remove('active');
        view2.style.display = 'block';
        view1.style.display = 'none';
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

/* --------------------------------------------------------------------------
   6. Smooth Scroll & Active Nav
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   7. Form Handler (Envoi direct d'email via FormSubmit AJAX)
   -------------------------------------------------------------------------- */
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    const statusMsg = document.getElementById('form-status');

    const name = document.getElementById('name').value.trim();
    const company = document.getElementById('company').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    submitBtn.disabled = true;
    submitBtn.innerHTML = currentLang === 'fr' 
        ? '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...' 
        : '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    
    statusMsg.className = 'form-status-msg';
    statusMsg.innerHTML = '';

    try {
        const response = await fetch('https://formsubmit.co/ajax/Jules.couprie@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `[Portfolio Contact] Message de ${name}${company ? ' (' + company + ')' : ''}`,
                _template: 'table',
                _captcha: 'false',
                Nom: name,
                Entreprise: company || 'Non renseignée',
                Email: email,
                Telephone: phone || 'Non renseigné',
                Message: message
            })
        });

        const data = await response.json();

        if (response.ok || data.success === 'true' || data.success === true) {
            statusMsg.className = 'form-status-msg success';
            statusMsg.innerHTML = currentLang === 'fr' 
                ? '<i class="fa-solid fa-circle-check"></i> Votre message a bien été envoyé ! Je vous répondrai dans les meilleurs délais.' 
                : '<i class="fa-solid fa-circle-check"></i> Your message has been sent successfully! I will get back to you shortly.';
            form.reset();
        } else {
            throw new Error('Erreur de transmission');
        }
    } catch (error) {
        // En cas de problème réseau, bascule automatique sur mailto
        const subjectText = `[Portfolio Contact] Message de ${name}${company ? ' (' + company + ')' : ''}`;
        const bodyText = `Nom / Prénom : ${name}\nEntreprise : ${company || 'Non renseignée'}\nEmail : ${email}\nTéléphone : ${phone || 'Non renseigné'}\n\nMessage :\n${message}`;
        window.location.href = `mailto:Jules.couprie@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = currentLang === 'fr' 
            ? '<i class="fa-solid fa-circle-check"></i> Votre client de messagerie a été ouvert avec votre message pour Jules.couprie@gmail.com.' 
            : '<i class="fa-solid fa-circle-check"></i> Your email client has been opened with your message for Jules.couprie@gmail.com.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
    }
}
