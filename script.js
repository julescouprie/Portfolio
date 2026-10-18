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
        hero_role: "Recherche d'un stage en Aérodynamisme & CFD",
        stat_estaca: "Cursus Ingénieur Aéronautique",
        stat_dur_val: "Stage 4 Mois",
        stat_duration: "Dès Mai 2027",
        stat_loc_val: "Mobilité",
        stat_location: "France & International",
        btn_contact: "Me Contacter",
        btn_cv: "Mon CV / Resume (PDF)",
        about_tag: "<i class=\"fa-solid fa-user-astronaut\"></i> Présentation",
        about_title: "Présentation",
        about_heading: "Mon Profil & Approche",
        about_p1: "Élève ingénieur en 4ᵉ année en Ingénierie Aéronautique à l'ESTACA, spécialisé en CFD, simulation FSI, maillage dynamique et optimisation aérodynamique. Je recherche activement un stage de 4 mois dans le domaine de l'aérodynamisme appliqué aux technologies de pointe et à la haute performance, disponible dès mai 2027.",
        about_p2: "Passionné par l'aérodynamique et les environnements de haute performance, je suis captivé par ces univers d'exigence où se mêlent ingénierie de pointe, rigueur scientifique et recherche continue du gain marginal.",
        about_p3: "Rigoureux et méthodique, j'aborde les défis techniques avec une approche scientifique structurée. Je souhaite mettre ma détermination et mon sens du travail en équipe au service d'une équipe d'ingénierie ou d'un bureau d'études ambitieux.",
        synth_title: "Fiche Synthétique",
        synth_name: "Nom :",
        synth_school: "Formation :",
        synth_school_val: "ESTACA (4ème année — Ingénierie Aéronautique)",
        synth_target: "Stage recherché :",
        synth_target_val: "Stage Aérodynamique & Optimisation CFD",
        synth_dates: "Durée & Période :",
        synth_dates_val: "Stage de 4 mois, dès mai 2027",
        synth_lang: "Anglais :",
        synth_loc: "Mobilité :",
        synth_loc_val: "France & International",
        synth_cv_btn: "Consulter mon CV (PDF)",
        synth_btn: "Contact",
        exp_tag: "<i class=\"fa-solid fa-timeline\"></i> Parcours",
        exp_title: "Expériences Professionnelles & Projets",
        exp_desc: "Chronologie complète de mes projets d'ingénierie et expériences professionnelles.",
        view_timeline: "<i class=\"fa-solid fa-timeline\"></i> Vue Chronologique",
        view_mosaic: "<i class=\"fa-solid fa-border-all\"></i> Vue Mosaïque",
        filter_all: "Tous les éléments",
        filter_pro: "Expériences pro",
        filter_perso_asso: "Projets associatifs & personnels",
        
        // Timeline Item 1: F1 Front Wing
        nb1_date: "<i class=\"fa-regular fa-calendar\"></i> Mai 2026 - En cours",
        nb1_title: "Conception et étude CFD d'un aileron avant de F1",
        nb1_sub: "Projet Personnel d'Ingénierie Aérodynamique • Jules COUPRIE & Tom CORBETT",
        nb1_summary: `<p class="preview-lead">Conception CAO 3DEXPERIENCE et étude CFD sous ANSYS Fluent (k-ω SST, y+ ≈ 1) d'un aileron avant multi-éléments s'appuyant sur la réglementation FIA. Déploiement d'un aéro-mapping par krigeage pour l'optimisation des formes aérodynamiques et la réduction des coûts de calcul, avec automatisation du workflow en Python.</p>
<div class="preview-tech"><strong>Outils :</strong> 3DEXPERIENCE • ANSYS Fluent • Krigeage • Python</div>`,
        nb1_btn: "Voir le Dossier Technique F1",

        // Timeline Item 2: Prague
        exp1_date: "<i class=\"fa-regular fa-calendar\"></i> Juin à Août 2026",
        exp1_title: "Stagiaire en Recherche Aérodynamique",
        exp1_sub: "Université ČVUT de Prague (Laboratoire de recherche)",
        exp1_desc: `<p class="preview-lead">Simulation numérique couplée fluide-structure bidirectionnelle (2-way FSI sous ANSYS Fluent & Mechanical via System Coupling) d'une pompe péristaltique. Résolution des contraintes de maillage dynamique sous fortes déformations et analyse des débits et reflux par scripts Python.</p>
<div class="preview-tech"><strong>Outils :</strong> ANSYS Fluent & Mechanical • System Coupling • Dynamic Remeshing • Python</div>`,
        exp1_btn: "Voir le Dossier du Stage",

        // Timeline Item 3: HYCE
        exp2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 à Présent",
        exp2_title: "Projet HYCE",
        exp2_sub: "Responsable Communication & Membre Pôle Système Embarqué",
        exp2_desc: `<p class="preview-lead">Rétrofit d'un prototype de course en moteur à combustion hydrogène (iDrogen ESTACA) visant le record du tour au Nürburgring. Membre de l'équipe systèmes embarqués (modélisation SIMULINK / Simscape Fluids, conformité FIA Art. 266) et responsable de la communication.</p>
<div class="preview-tech"><strong>Domaines :</strong> MATLAB / SIMULINK • Réglementation FIA H2 • Communication & Partenaires</div>`,
        exp2_btn: "Voir le Dossier Technique HYCE",

        // Timeline Item 4: UCAV
        nb2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 à 2026",
        nb2_title: "Dimensionnement, conception et performances d'un UCAV",
        nb2_sub: "Projet d'École ESTACA • Intervenants Thales & Dassault Aviation",
        nb2_summary: `<p class="preview-lead">Projet de synthèse à l'ESTACA encadré par des intervenants de Thales et Dassault Aviation : dimensionnement global, modélisation surfacique 3DEXPERIENCE et calculs des performances en vol (polaires subsoniques à Mach 0.8, rayon d'action Breguet et compromis de stabilité) d'une aile volante UCAV.</p>
<div class="preview-tech"><strong>Thèmes :</strong> 3DEXPERIENCE • Aérodynamique & Polaires • Dimensionnement UCAV</div>`,
        nb2_btn: "Voir le Dossier Technique UCAV",

        // Timeline Item 5: SD Aviation
        exp4_date: "<i class=\"fa-regular fa-calendar\"></i> Juillet 2024",
        exp4_title: "Opérateur de Vol • SD Aviation",
        exp4_sub: "La Roche-sur-Yon",
        exp4_desc: `<p class="preview-lead">Immersion opérationnelle en aviation d'affaires : préparation et suivi des vols via les outils Léon et ForeFlight, et contribution à la rédaction des matrices de conformité et procédures de contrôle technique des aéronefs.</p>
<div class="preview-tech"><strong>Domaines :</strong> Opérations en vol • Léon / ForeFlight • Procédures de conformité</div>`,

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
        contact_desc: "Recherche active d'un stage de 4 mois à partir de mai 2027. Prêt à échanger sur mes projets et ma candidature.",
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
        hero_role: "Seeking an Internship in Aerodynamics & CFD",
        stat_estaca: "Aeronautical Engineering",
        stat_dur_val: "4-Month Internship",
        stat_duration: "From May 2027",
        stat_loc_val: "Mobility",
        stat_location: "France & Worldwide",
        btn_contact: "Contact Me",
        btn_cv: "My Resume (PDF)",
        about_tag: "<i class=\"fa-solid fa-user-astronaut\"></i> Overview",
        about_title: "Overview",
        about_heading: "About Me & Approach",
        about_p1: "As a 4th-year Aeronautical Engineering student at ESTACA, specialized in CFD, FSI simulation, dynamic meshing, and aerodynamic optimization, I am actively seeking a 4-month internship in Aerodynamics & CFD within high-performance engineering and advanced technologies, available from May 2027.",
        about_p2: "Passionate about aerodynamics and high-performance engineering, I thrive in demanding environments combining cutting-edge engineering, scientific rigor, and the continuous pursuit of performance.",
        about_p3: "Rigorously methodical, I tackle technical challenges with a structured scientific approach. I aim to bring my determination and teamwork skills to an ambitious engineering team or design office.",
        synth_title: "Key Details",
        synth_name: "Name:",
        synth_school: "Education:",
        synth_school_val: "ESTACA (Master's Degree in Aeronautical Engineering)",
        synth_target: "Seeking:",
        synth_target_val: "Aerodynamics & CFD Optimization",
        synth_dates: "Duration & Timing:",
        synth_dates_val: "4-Month Internship, from May 2027",
        synth_lang: "English:",
        synth_loc: "Mobility:",
        synth_loc_val: "France & International Mobility",
        synth_cv_btn: "View My Resume (PDF)",
        synth_btn: "Contact",
        exp_tag: "<i class=\"fa-solid fa-timeline\"></i> Timeline",
        exp_title: "Professional Experience & Projects",
        exp_desc: "Comprehensive timeline of engineering projects and work experience.",
        view_timeline: "<i class=\"fa-solid fa-timeline\"></i> Timeline View",
        view_mosaic: "<i class=\"fa-solid fa-border-all\"></i> Grid View",
        filter_all: "All Items",
        filter_pro: "Work Experience",
        filter_perso_asso: "Projects & Student Associations",

        // Timeline Item 1: F1 Front Wing (EN)
        nb1_date: "<i class=\"fa-regular fa-calendar\"></i> May 2026 - Present",
        nb1_title: "F1 Front Wing Design & CFD Study",
        nb1_sub: "Aerodynamic Engineering Personal Project • Jules COUPRIE & Tom CORBETT",
        nb1_summary: `<p class="preview-lead">3DEXPERIENCE CAD design and ANSYS Fluent CFD study (k-ω SST, y+ ≈ 1) of an FIA-inspired multi-element front wing. Deployment of a Kriging surrogate model for aerodynamic shape optimization and compute time reduction, supported by an automated Python workflow.</p>
<div class="preview-tech"><strong>Tools:</strong> 3DEXPERIENCE • ANSYS Fluent • Kriging • Python</div>`,
        nb1_btn: "View F1 Technical Dossier",

        // Timeline Item 2: Prague (EN)
        exp1_date: "<i class=\"fa-regular fa-calendar\"></i> June to August 2026",
        exp1_title: "Aerodynamics Researcher Intern",
        exp1_sub: "ČVUT University of Prague (Research Laboratory)",
        exp1_desc: `<p class="preview-lead">Two-way Fluid-Structure Interaction numerical simulation (2-way FSI with ANSYS Fluent & Mechanical via System Coupling) of a peristaltic pump. Handling dynamic remeshing challenges under severe deformation, with flow and backflow evaluation using Python scripts.</p>
<div class="preview-tech"><strong>Tools:</strong> ANSYS Fluent & Mechanical • System Coupling • Dynamic Remeshing • Python</div>`,
        exp1_btn: "View Internship Dossier",

        // Timeline Item 3: HYCE (EN)
        exp2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 to Present",
        exp2_title: "HYCE Project",
        exp2_sub: "Head of Communications & Embedded Systems Member",
        exp2_desc: `<p class="preview-lead">Racing prototype retrofit converting an ICE car to hydrogen combustion (iDrogen ESTACA), targeting the Nürburgring lap record. Embedded systems team member (SIMULINK / Simscape Fluids modeling, FIA Art. 266 compliance) and Head of Communications.</p>
<div class="preview-tech"><strong>Areas:</strong> MATLAB / SIMULINK • FIA H2 Regulations • Communications & Outreach</div>`,
        exp2_btn: "View HYCE Technical Dossier",

        // Timeline Item 4: UCAV (EN)
        nb2_date: "<i class=\"fa-regular fa-calendar\"></i> 2025 to 2026",
        nb2_title: "Sizing, CAD Design & Performances of a UCAV",
        nb2_sub: "ESTACA School Project • Guest Lectures from Thales & Dassault Aviation",
        nb2_summary: `<p class="preview-lead">ESTACA academic project mentored by Thales and Dassault Aviation engineers: global sizing, 3DEXPERIENCE surface modeling, and flight performance analysis (subsonic polars at Mach 0.8, Breguet range, stability trade-offs) for a flying-wing UCAV.</p>
<div class="preview-tech"><strong>Topics:</strong> 3DEXPERIENCE • Aerodynamics & Polars • Sizing & Stability</div>`,
        nb2_btn: "View UCAV Technical Dossier",

        // Timeline Item 5: SD Aviation (EN)
        exp4_date: "<i class=\"fa-regular fa-calendar\"></i> July 2024",
        exp4_title: "Flight Operations Officer • SD Aviation",
        exp4_sub: "La Roche-sur-Yon, France",
        exp4_desc: `<p class="preview-lead">Operational immersion in business aviation: flight planning and monitoring using Léon and ForeFlight tools, and contribution to drafting aircraft compliance matrices and inspection procedures.</p>
<div class="preview-tech"><strong>Areas:</strong> Flight Operations • Léon / ForeFlight • Airworthiness Compliance</div>`,

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
        contact_desc: "Actively seeking a 4-month internship starting in May 2027. Ready to discuss my technical projects and application.",
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

    const synthCvLink = document.getElementById('synth-cv-link');
    if (synthCvLink) {
        synthCvLink.href = currentLang === 'fr' ? 'assets/cv_jules_couprie_fr.pdf' : 'assets/cv_jules_couprie_en.pdf';
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
            subtitle: "Projet Personnel d'Ingénierie Aérodynamique (Mai 2026 - En cours)",
            badgeTag: "DOSSIER TECHNIQUE AILERON AVANT F1",
            isCustomF1Layout: true,
            
            generalPres: "Projet d'ingénierie aérodynamique mené en binôme avec Tom CORBETT (élève ingénieur ESTACA, expérience chez Williams F1 Racing), avec l'appui technique de Louis GUIDET (Aérodynamicien chez Alpine F1 Team) et le soutien d'enseignants-chercheurs de l'ONERA et de l'ESTACA. Le travail s'appuie sur la réglementation technique FIA Formule 1 et les démarches appliquées en bureau d'études, tout en conservant une liberté d'exploration sur les concepts aérodynamiques.",

            objectivesBullets: [
                "Analyser en profondeur les phénomènes aérodynamiques complexes régissant un aileron avant multi-éléments moderne (modèle k-ω SST, raffinement couche limite y+ ≈ 1).",
                "Développer une modélisation CAO paramétrique sous 3DEXPERIENCE et mener des simulations CFD itératives sous ANSYS Fluent (du profil 2D mono-élément jusqu'à l'aileron 3D complet).",
                "Mettre en place un aéro-mapping par méthode de krigeage (processus gaussiens) pour cartographier l'enveloppe, optimiser les formes et réduire drastiquement le nombre de simulations Navier-Stokes requises.",
                "Automatiser l'ensemble de la chaîne numérique CAO-CFD-post-traitement via des scripts Python et une application sur-mesure de tracé de profils développée avec assistance d'IA."
            ],

            aeroMappingPres: "Pour explorer un large espace géométrique sans subir le coût de centaines de calculs Navier-Stokes 3D complets, nous déployons un métamodèle de krigeage (Gaussian Process Regression). Ce modèle d'interpolation spatiale et de prédiction évalue le comportement aéro global tout en réduisant considérablement le nombre de simulations requises.",

            aeroMappingBullets: [
                "<strong>Gain de temps de calcul :</strong> Interpolation précise des coefficients aérodynamiques (Cz, Cx, L/D, Cpt) sur l'ensemble du domaine à partir d'un échantillonnage optimisé (DoE), réduisant de plus de 80% le besoin de calculs lourds.",
                "<strong>Optimisation de forme :</strong> Exploration continue des paramètres géométriques clés : lois de cambrure des profils, angle d'incidence des flaps, garde au sol avant (effet de sol) et gestion des fentes (slots & overlap).",
                "<strong>Validation croisée & réentraînement :</strong> Comparaison des prédictions à des points de contrôle haute fidélité ANSYS Fluent pour réentraîner le modèle sur les zones à plus forte incertitude."
            ],

            workflowPres: "Dans un souci d'efficacité et de répétabilité, nous avons automatisé la chaîne numérique liant la géométrie à l'analyse de données.",

            workflowBullets: [
                "<strong>Pipeline automatisé CAO ➔ Maillage ➔ Solveur Fluent :</strong> Scripting Python orchestrant la mise à jour géométrique CAO, le maillage fluide adapté (y+ ≈ 1) et l'exécution des calculs sous ANSYS Fluent.",
                "<strong>Application de génération de profils :</strong> Outil Python développé avec assistance d'IA pour tracer, lisser et exporter des coordonnées de profils performants.",
                "<strong>Post-traitement automatisé :</strong> Scripts Python extrayant automatiquement les polaires d'efforts, les cartographies de pression totale Cpt à 1 m en aval et la structure du sillage latéral (outwash)."
            ],

            metricsBullets: [
                "Finesse aérodynamique globale (L/D) : compromis traînée Cx et appui Cz sur l'ensemble de l'assiette.",
                "Sensibilité à la hauteur de caisse avant : cartographie de l'effet de sol et des gradients d'appui à faible garde au sol.",
                "Coefficient de pression totale Cpt (mesuré à 1 m en aval) : caractérisation des pertes de charge et du sillage.",
                "Structure du sillage latéral (sidewash / outwash) : optimisation de l'endplate pour dévier l'air turbulent hors des roues avant."
            ],

            skillsAndTools: [
                "Aéro-mapping & Krigeage (Processus Gaussiens & DoE)",
                "Automatisation de workflow Python (CAO-CFD-Post-traitement)",
                "3DEXPERIENCE (Modélisation surfacique paramétrique 2D/3D)",
                "Suite ANSYS Fluent (Maillage y+ ≈ 1, k-ω SST)",
                "Réglementation FIA Formule 1 & Méthodologie BE"
            ],

            pdfLinkText: "📄 Consulter la Présentation Technique F1 (PDF)",
            pdfLinkUrl: "assets/portfolio_f1.pdf"
        },
        en: {
            title: "F1 Front Wing Design & CFD Study",
            subtitle: "Aerodynamic Engineering Personal Project (May 2026 - Present)",
            badgeTag: "F1 FRONT WING TECHNICAL DOSSIER",
            isCustomF1Layout: true,
            
            generalPres: "High-fidelity aerodynamic engineering project conducted in collaboration with Tom CORBETT (ESTACA engineering student, experience at Williams F1 Racing), with technical guidance from Louis GUIDET (Aerodynamicist at Alpine F1 Team) and faculty support from ONERA and ESTACA. Grounded in FIA Formula 1 technical regulations and design office practices, while maintaining exploration freedom on aerodynamic concepts.",

            objectivesBullets: [
                "Gain deep insight into complex aerodynamic phenomena governing a modern multi-element Formula 1 front wing (k-ω SST model, boundary layer refinement y+ ≈ 1).",
                "Build a complete parametric CAD model in 3DEXPERIENCE and conduct iterative CFD simulations in ANSYS Fluent (from 2D airfoils to complete 3D wing).",
                "Deploy an aerodynamic mapping based on Kriging (Gaussian Process Regression) to map the design space, optimize shapes, and drastically reduce computational cost.",
                "Automate the end-to-end CAD-to-CFD computational workflow using Python scripting and a custom AI-assisted airfoil generation application."
            ],

            aeroMappingPres: "To explore an extensive design space without incurring the prohibitive cost of hundreds of full 3D Navier-Stokes simulations, we deploy an aerodynamic surrogate model based on Kriging. This spatial interpolation model evaluates global aerodynamic behavior while substantially reducing computational budget.",

            aeroMappingBullets: [
                "<strong>Massive Compute Time Savings :</strong> Accurate prediction and interpolation of aerodynamic coefficients (Cz, Cx, L/D, Cpt) across the envelope from an optimized sample (DoE), cutting heavy solver demand by over 80%.",
                "<strong>Continuous Shape Optimization :</strong> Exploring design variables continuously: camber distributions, flap angles of attack, front ride height (ground effect sensitivity), and multi-element slot gaps and overlaps.",
                "<strong>Cross-Validation & Adaptive Retraining :</strong> Benchmarking surrogate predictions against high-fidelity ANSYS Fluent check-points to retrain the algorithm in higher-uncertainty regimes."
            ],

            workflowPres: "To ensure repeatability and industrial-grade throughput, we automated the numerical pipeline linking CAD geometry to CFD results.",

            workflowBullets: [
                "<strong>Automated CAD ➔ Meshing ➔ Fluent Pipeline :</strong> Python scripting coordinating parametric CAD geometry updates, wall-resolved boundary layer meshing (y+ ≈ 1), and batch Fluent solver runs.",
                "<strong>AI-Assisted Airfoil Generation Tool :</strong> Custom Python application developed with AI assistance to generate, smooth, and parameterize airfoil coordinates prior to simulation.",
                "<strong>Automated Post-Processing :</strong> Routines automatically extracting force polars, 1-meter downstream total pressure loss maps (Cpt), and wake deflection (outwash)."
            ],

            metricsBullets: [
                "Overall Aerodynamic Efficiency (L/D): continuous optimization of drag Cx vs. downforce Cz across the aero map.",
                "Front Ride Height Sensitivity: mapping ground-effect dynamics and downforce gradients at low ground clearances.",
                "Total Pressure Coefficient Cpt (1 m downstream): tracking wake energy and total pressure losses.",
                "Lateral wake deflection (sidewash / outwash): optimizing endplate geometry to route turbulent air away from front wheels."
            ],

            skillsAndTools: [
                "Aero Mapping & Kriging (Gaussian Process Regression & DoE)",
                "Python Numerical Automation (CAD-CFD-Post-Processing)",
                "3DEXPERIENCE (Parametric Surface CAD Modeling 2D/3D)",
                "ANSYS Suite (Fluent, y+ ≈ 1 meshing, k-ω SST)",
                "FIA Formula 1 Regulations & Design Office Practices"
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
            title: "Stage Chercheur : Simulation FSI & Optimisation d'une Pompe Péristaltique",
            subtitle: "Université ČVUT de Prague (Laboratoire de Recherche, Juin à Août 2026)",
            badgeTag: "STAGE CHERCHEUR ČVUT PRAGUE",
            ndaNote: "Note de Confidentialité : Travail soumis à un accord de confidentialité (NDA) signé avec l'entreprise partenaire.",
            subjectText: "Sujet de recherche : <em>Simulation and initial design of peristaltic pump</em>. Modélisation 3D CAO sous 3DEXPERIENCE, analyse CFD d'écoulements internes et simulation couplée fluide-structure bidirectionnelle (2-way FSI) sous la suite ANSYS (Fluent, Mechanical & System Coupling).",
            
            researchContribTitle: "Bilan des travaux & démarche réalisée",
            researchContribBullets: [
                "<strong>Modélisation couplée fluide-structure (2-way FSI) :</strong> Mise en œuvre d'un couplage sous ANSYS System Coupling entre les solveurs Fluent (écoulement interne) et Mechanical (déformation élastique du tube) pour observer le comportement transitoire de la pompe.",
                "<strong>Gestion du remaillage dynamique :</strong> Paramétrage des méthodes de Dynamic Remeshing sous Fluent afin d'éviter l'écrasement critique des mailles lors de l'occlusion complète du tube élastomère.",
                "<strong>Extraction et traitement des données :</strong> Développement de scripts Python pour tracer les courbes de débit volumique instantané et caractériser les reflux (backflow).",
                "<strong>Restitution technique :</strong> Présentation des méthodologies et des résultats en anglais devant l'équipe de recherche du laboratoire."
            ],

            skillsCFD: [
                "Couplage FSI Bidirectionnel (2-Way) : Intégration multiphysique sous ANSYS System Coupling entre les solveurs Fluent et Mechanical.",
                "CFD Interne & Maillage Dynamique : Maîtrise des algorithmes de remaillage automatique (Dynamic Meshes) s'adaptant aux déformations du tube.",
                "Post-traitement Avancé Python : Développement de scripts sous PyCharm et ParaView pour le calcul de débit volumique et de reflux."
            ],
            skillsGeneral: [
                "Modélisation 3D CAO Paramétrique : Conception géométrique initiale de la pompe sous 3DEXPERIENCE.",
                "Programmation Python & Automatisation : Codage sous PyCharm pour le traitement de données CFD.",
                "Communication & Soutenance en Anglais : Présentation technique des résultats devant un jury de chercheurs et maîtres de stage."
            ],

            softwareList: [
                "ANSYS Fluent (Solveur CFD)",
                "ANSYS Mechanical (Solveur Structure)",
                "ANSYS System Coupling (Couplage 2-Way FSI)",
                "3DEXPERIENCE (3DX - CAO Paramétrique)",
                "ParaView & PyCharm (Post-traitement Python)"
            ],

            others: {
                difficulties: "Problématiques complexes d'écrasement quasi-total de la veine fluide générant de fortes distorsions de maillage, résolues par un remaillage dynamique adaptatif fin.",
                visits: "Visites guidées des centres de recherche aérospatiale tchèques (VZLU) et bancs d'essai de turbomoteurs civils et militaires à Prague."
            },

            photoGallery: false
        },
        en: {
            title: "Research Intern: FSI Simulation & Optimization of a Peristaltic Pump",
            subtitle: "ČVUT University of Prague (Research Laboratory, June to August 2026)",
            badgeTag: "RESEARCH INTERNSHIP ČVUT PRAGUE",
            ndaNote: "Confidentiality Notice: Work subject to a Non-Disclosure Agreement (NDA) signed with the corporate partner.",
            subjectText: "Research Topic: <em>Simulation and initial design of peristaltic pump</em>. 3D CAD modeling in 3DEXPERIENCE, internal CFD flow analysis, and two-way Fluid-Structure Interaction (FSI) simulations using the ANSYS Suite (Fluent, Mechanical & System Coupling).",
            
            researchContribTitle: "Summary of Work & Methodology",
            researchContribBullets: [
                "<strong>Two-way FSI Coupling:</strong> Configuring a coupled fluid-structure interaction simulation with ANSYS System Coupling (Fluent for internal flow and Mechanical for elastomer tube deformation) to analyze transient pump dynamics.",
                "<strong>Dynamic Remeshing Configuration:</strong> Setting up adaptive remeshing parameters in Fluent to prevent cell distortion and negative volumes during complete tube occlusion.",
                "<strong>Data Extraction & Post-Processing:</strong> Developing Python scripts in PyCharm to evaluate instantaneous flow rates and identify backflow phenomena.",
                "<strong>Technical Presentation:</strong> Documenting methodologies and presenting findings in English to the laboratory research team."
            ],

            skillsCFD: [
                "Two-Way FSI Coupling: Multiphysics co-simulation using ANSYS System Coupling between Fluent and Mechanical solvers.",
                "Internal CFD & Dynamic Remeshing: Mastering automated remeshing algorithms tracking severe transient geometry changes.",
                "Advanced Python Post-Processing: Custom PyCharm/ParaView scripts to extract flow rate, backflow, and shear rates."
            ],
            skillsGeneral: [
                "Parametric 3D CAD Modeling: Initial geometric design in 3DEXPERIENCE.",
                "Python Scripting: Automated post-processing pipelines developed in PyCharm.",
                "Oral Defense in English: Research presentation and technical discussion before PhD advisors and researchers."
            ],

            softwareList: [
                "ANSYS Fluent (CFD Solver)",
                "ANSYS Mechanical (Structural FEA Solver)",
                "ANSYS System Coupling (2-Way FSI)",
                "3DEXPERIENCE (3DX Parametric CAD)",
                "ParaView & PyCharm (Python Post-processing)"
            ],

            others: {
                difficulties: "Complex meshing challenges under near-total fluid channel pinch-off, successfully resolved via customized adaptive remeshing laws.",
                visits: "Technical visits to Czech aerospace research institutes (VZLU) and turboprop/turbojet engine test benches in Prague."
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
                    
                    <!-- Galerie photos F1 (non-cliquables, affichage épuré) -->
                    <div class="f1-photos-simple">
                        <div class="f1-photo-frame">
                            <img src="assets/f1_cad_front_wing.png" alt="Aileron avant F1 - CAO 3D">
                        </div>
                        <div class="f1-photo-frame">
                            <img src="assets/f1_cfd_pressure_contour.jpg" alt="Aileron avant F1 - CFD 2D">
                        </div>
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic; text-align: center; margin-top: -0.3rem; margin-bottom: 0.3rem;">
                        <i class="fa-solid fa-circle-info"></i> ${currentLang === 'fr' ? 'Visuels exploratoires en cours de projet (non représentatifs du résultat final).' : 'Exploratory working visuals (non-final results).'}
                    </div>

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Présentation générale & Encadrement' : 'General Overview & Mentorship'}</h4>
                        <p class="notebook-p">${data.generalPres}</p>
                    </div>

                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4">${currentLang === 'fr' ? 'Objectifs du projet' : 'Project Objectives'}</h4>
                        <ul class="notebook-ul">
                            ${data.objectivesBullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>

                    ${data.aeroMappingPres ? `
                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4" style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-chart-line"></i> ${currentLang === 'fr' ? 'Aéro-mapping & Méthode de Krigeage' : 'Aero Mapping & Kriging Surrogate Model'}
                        </h4>
                        <p class="notebook-p" style="margin-bottom: 0.75rem;">${data.aeroMappingPres}</p>
                        <ul class="notebook-ul">
                            ${data.aeroMappingBullets.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    ${data.workflowPres ? `
                    <div class="modal-flow-section">
                        <h4 class="notebook-section-h4" style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-gears"></i> ${currentLang === 'fr' ? 'Optimisation du Workflow & Automatisation' : 'Workflow Optimization & Automation'}
                        </h4>
                        <p class="notebook-p" style="margin-bottom: 0.75rem;">${data.workflowPres}</p>
                        <ul class="notebook-ul">
                            ${data.workflowBullets.map(w => `<li>${w}</li>`).join('')}
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
                        <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.5rem;">
                            ${data.skillsAndTools.map(st => `<span class="skill-pill" style="font-weight: 500;"><i class="fa-solid fa-check"></i> ${st}</span>`).join('')}
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

                ${data.researchContribBullets ? `
                <div class="modal-flow-section">
                    <h4 class="notebook-section-h4" style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-clipboard-check"></i> ${data.researchContribTitle || (currentLang === 'fr' ? 'Bilan des travaux & démarche réalisée' : 'Summary of Work & Methodology')}
                    </h4>
                    <ul class="notebook-ul">
                        ${data.researchContribBullets.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

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
