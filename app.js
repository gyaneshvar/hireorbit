document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVBAR FUNCTIONALITY ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Scroll handling for shrinking Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightActiveSection();
    });
    
    // Mobile navigation toggle
    navToggle.addEventListener('click', () => {
        const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isOpened);
        navToggle.classList.toggle('open');
        navLinksContainer.classList.toggle('open');
    });
    
    // Close mobile nav when clicking a link
    navLinksContainer.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('open');
            navLinksContainer.classList.remove('open');
        }
    });

    // Highlighting active nav section
    function highlightActiveSection() {
        let scrollPosition = window.scrollY + 150;
        
        document.querySelectorAll('section').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // --- DUAL TAB FORM FUNCTIONALITY ---
    const formToggleBtns = document.querySelectorAll('.form-toggle-btn');
    const employerForm = document.getElementById('employer-form');
    const candidateForm = document.getElementById('candidate-form');
    
    formToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            formToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (tabName === 'employer') {
                employerForm.classList.add('active');
                candidateForm.classList.remove('active');
            } else {
                candidateForm.classList.add('active');
                employerForm.classList.remove('active');
            }
        });
    });

    // Wires for Hero CTAs & Header Links to toggle tabs accordingly
    document.getElementById('hero-cta-employer').addEventListener('click', () => {
        switchTab('employer');
    });

    document.getElementById('hero-cta-candidate').addEventListener('click', () => {
        switchTab('candidate');
    });

    document.getElementById('nav-employers-link').addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('employer');
        scrollToForm();
    });

    document.getElementById('nav-candidates-link').addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('candidate');
        scrollToForm();
    });

    document.getElementById('nav-cta').addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('employer');
        scrollToForm();
    });

    function switchTab(tabName) {
        const btn = document.querySelector(`.form-toggle-btn[data-tab="${tabName}"]`);
        if (btn) btn.click();
    }

    function scrollToForm() {
        document.getElementById('intake').scrollIntoView({ behavior: 'smooth' });
    }

    // --- CANDIDATE RESUME FILE DRAG AND DROP ---
    const resumeZone = document.getElementById('resume-upload-zone');
    const resumeInput = document.getElementById('candidate-resume');
    const previewText = document.getElementById('file-preview-text');
    const resumeFeedback = document.getElementById('candidate-resume-feedback');
    let attachedFile = null;

    resumeZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        resumeZone.style.borderColor = 'var(--color-cyan)';
    });

    resumeZone.addEventListener('dragleave', () => {
        resumeZone.style.borderColor = 'var(--glass-border)';
    });

    resumeZone.addEventListener('drop', (e) => {
        e.preventDefault();
        resumeZone.style.borderColor = 'var(--glass-border)';
        
        if (e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    resumeInput.addEventListener('change', () => {
        if (resumeInput.files.length > 0) {
            handleFileSelection(resumeInput.files[0]);
        }
    });

    function handleFileSelection(file) {
        const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
        if (!allowedExtensions.exec(file.name)) {
            showToast('Invalid file format. Please upload a PDF, DOC, or DOCX document.', 'error');
            attachedFile = null;
            previewText.textContent = 'No file chosen';
            previewText.style.display = 'none';
            resumeInput.value = '';
            return;
        }
        
        attachedFile = file;
        previewText.textContent = `Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        previewText.style.display = 'block';
        resumeFeedback.style.display = 'none';
    }

    // --- FORM VALIDATION & SUBMISSION HANDLING ---
    const toast = document.getElementById('form-toast');
    const toastMsg = document.getElementById('toast-message');

    function showToast(message, type = 'success') {
        toastMsg.textContent = message;
        toast.className = `form-toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    // Employer Form Submit
    employerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const companyName = document.getElementById('company-name');
        const companyFeedback = document.getElementById('company-name-feedback');
        if (!companyName.value.trim()) {
            companyName.classList.add('is-invalid');
            companyFeedback.style.display = 'block';
            isValid = false;
        } else {
            companyName.classList.remove('is-invalid');
            companyName.classList.add('is-valid');
            companyFeedback.style.display = 'none';
        }
        
        const email = document.getElementById('employer-email');
        const emailFeedback = document.getElementById('employer-email-feedback');
        if (!email.value.trim() || !validateEmail(email.value)) {
            email.classList.add('is-invalid');
            emailFeedback.style.display = 'block';
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
            emailFeedback.style.display = 'none';
        }
        
        const roles = document.getElementById('hiring-role');
        const rolesFeedback = document.getElementById('hiring-role-feedback');
        if (!roles.value.trim()) {
            roles.classList.add('is-invalid');
            rolesFeedback.style.display = 'block';
            isValid = false;
        } else {
            roles.classList.remove('is-invalid');
            roles.classList.add('is-valid');
            rolesFeedback.style.display = 'none';
        }
        
        if (!isValid) {
            showToast('Please fix the errors in the form before submitting.', 'error');
            return;
        }
        
        // Form is valid - construct mailto draft
        const experience = document.getElementById('hiring-experience').value;
        const details = document.getElementById('hiring-details').value;
        
        const subject = encodeURIComponent(`[Hire Orbit] Sourcing Request from ${companyName.value.trim()}`);
        const body = encodeURIComponent(
            `Hire Orbit Sourcing Request Details:\n` +
            `-----------------------------------\n` +
            `Company Name: ${companyName.value.trim()}\n` +
            `Work Email: ${email.value.trim()}\n` +
            `Positions / Stack: ${roles.value.trim()}\n` +
            `Experience Preference: ${experience}\n` +
            `Additional details: ${details ? details.trim() : 'N/A'}\n\n` +
            `Sent from hireorbit.co.in intake form.`
        );
        
        // Open email client
        window.location.href = `mailto:info@hireorbit.co.in?subject=${subject}&body=${body}`;
        
        showToast('Requirement details validated! Opening your email client to complete submission...', 'success');
        employerForm.reset();
        document.querySelectorAll('#employer-form .form-control').forEach(el => el.classList.remove('is-valid'));
    });

    // Candidate Form Submit
    candidateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const name = document.getElementById('candidate-name');
        const nameFeedback = document.getElementById('candidate-name-feedback');
        if (!name.value.trim()) {
            name.classList.add('is-invalid');
            nameFeedback.style.display = 'block';
            isValid = false;
        } else {
            name.classList.remove('is-invalid');
            name.classList.add('is-valid');
            nameFeedback.style.display = 'none';
        }
        
        const email = document.getElementById('candidate-email');
        const emailFeedback = document.getElementById('candidate-email-feedback');
        if (!email.value.trim() || !validateEmail(email.value)) {
            email.classList.add('is-invalid');
            emailFeedback.style.display = 'block';
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
            emailFeedback.style.display = 'none';
        }
        
        const skills = document.getElementById('candidate-skills');
        const skillsFeedback = document.getElementById('candidate-skills-feedback');
        if (!skills.value.trim()) {
            skills.classList.add('is-invalid');
            skillsFeedback.style.display = 'block';
            isValid = false;
        } else {
            skills.classList.remove('is-invalid');
            skills.classList.add('is-valid');
            skillsFeedback.style.display = 'none';
        }
        
        if (!attachedFile) {
            resumeFeedback.style.display = 'block';
            isValid = false;
        } else {
            resumeFeedback.style.display = 'none';
        }
        
        if (!isValid) {
            showToast('Please fix the errors and ensure your resume is attached.', 'error');
            return;
        }
        
        // Form is valid - construct mailto draft
        const linkedin = document.getElementById('candidate-linkedin').value;
        const msg = document.getElementById('candidate-message').value;
        
        const subject = encodeURIComponent(`[Hire Orbit] Candidate Profile - ${name.value.trim()}`);
        const body = encodeURIComponent(
            `Candidate Submission details:\n` +
            `-----------------------------\n` +
            `Full Name: ${name.value.trim()}\n` +
            `Email: ${email.value.trim()}\n` +
            `Core Skills: ${skills.value.trim()}\n` +
            `LinkedIn/Portfolio: ${linkedin ? linkedin.trim() : 'N/A'}\n` +
            `Resume Filename: ${attachedFile.name}\n` +
            `Introduction Message: ${msg ? msg.trim() : 'N/A'}\n\n` +
            `IMPORTANT: Please ensure the file [${attachedFile.name}] is attached to this email before sending.\n\n` +
            `Sent from hireorbit.co.in intake form.`
        );
        
        // Open email client
        window.location.href = `mailto:info@hireorbit.co.in?subject=${subject}&body=${body}`;
        
        showToast('Profile details validated! Opening your email client to send resume...', 'success');
        candidateForm.reset();
        attachedFile = null;
        previewText.textContent = 'No file chosen';
        previewText.style.display = 'none';
        document.querySelectorAll('#candidate-form .form-control').forEach(el => el.classList.remove('is-valid'));
    });
});
