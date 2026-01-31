let pipelineChart = null;

function getCSRFToken() {
    const meta = document.querySelector("meta[name='csrf-token']");
    return meta ? meta.getAttribute("content") : "";
}


/* ------------------------------
   0. LOGIN BUTTON HANDLER
--------------------------------*/
function initLoginButton() {
    const loginbtn = document.getElementById("login_btn");
    if (!loginbtn) return;  
    
    loginbtn.addEventListener("click", () => {
        const usernameInput = document.getElementById("username"); // or whatever your input ID is
        const passwordInput = document.getElementById("password"); // or whatever your input ID is
        
        if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
            alert("Please fill in all fields!");
            e.preventDefault();
            return;
        }
        loginbtn.textContent = "Verifying...";
        loginbtn.style.backgroundColor= "skyblue";
    });
}


/* ------------------------------
   1. FLASH MESSAGE HANDLER
--------------------------------*/
const msg = document.getElementById("messages");
if (msg) {
    setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => (msg.style.display = "none"), 500);
    }, 5000);
}


/* ------------------------------
   2. DASHBOARD CHART
--------------------------------*/
function initDashboardChart() {
    const chartElement = document.getElementById("pipelineChart");
    if (!chartElement) return;

    fetch("/dashboard/charts/", {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(res => res.json())
    .then(data => {

        const values = [
            data.saved,
            data.applied,
            data.interview,
            data.offer,
            data.accepted,
            data.rejected
        ];

        // ✅ UPDATE EXISTING CHART
        if (pipelineChart) {
            pipelineChart.data.datasets[0].data = values;
            pipelineChart.update();
            return;
        }

        // 🆕 CREATE CHART ONCE
        const ctx = chartElement.getContext("2d");
        pipelineChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [
                    "Saved",
                    "Applied",
                    "Interview",
                    "Offer",
                    "Accepted",
                    "Rejected"
                ],
                datasets: [{
                    data: values,
                    backgroundColor: [
                        "#94a3b8", // Saved
                        "#3b82f6", // Applied
                        "#facc15", // Interview
                        "#22c55e", // Offer
                        "#16a34a", // Accepted
                        "#ef4444"  // Rejected
                    ],
                    borderRadius: 6,
                    barThickness: 30
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    })
    .catch(err => console.error("Chart fetch failed:", err));
}


/* ------------------------------
   2. DASHBOARD JOB CARDS COUNT
--------------------------------*/
function updateDashboardCntCards(){
    fetch("/dashboard_card/counts/", {
        headers:{
            "X-Requested-With": "XMLHttpRequest"
        }
    })
    .then(res =>res.json())
    .then(data =>{
        const totalJobs = document.getElementById("totalJobs");
        const appliedJobs = document.getElementById("appliedJobs");
        const Interviews = document.getElementById("jobInterviews");
        const offers = document.getElementById("jobOffers");

        if(totalJobs) totalJobs.textContent = data.total_jobs;
        if(appliedJobs) appliedJobs.textContent = data.applied_jobs;
        if(Interviews) Interviews.textContent = data.got_interviews;
        if(offers) offers.textContent = data.job_offers;
    });
}
/* ------------------------------
   3. DASHBOARD RECENT ACTIVITIES VIEWS
--------------------------------*/
function initRecentApplications(){
    const recentbox = document.getElementById("recentActivityList");
    if(!recentbox) return;

    fetch("/application-recentList/",{
        headers:{"X-Requested-With": "XMLHttpRequest"}
    })
    .then(res=>res.text())
    .then(html=>{
        recentbox.innerHTML = html;
    });
}


/* ------------------------------
   3. SKILL FORM INITIALIZER
--------------------------------*/
function initSkillForm() {
    const skillForm = document.getElementById("skillForm");
    const modal = document.getElementById("skillmodel");
    const skillsContainer = document.getElementById("skillsBox");

    if (!skillForm || !modal || !skillsContainer) return;

    skillForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(skillForm);

        fetch("/skills/add/", {
            method: "POST",
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                "X-Requested-With": "XMLHttpRequest"
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            const card = document.createElement("div");
            card.className = "skill-card";
            card.innerHTML = `
                <h3>${data.name}</h3>
                <span class="badge">${data.level}</span>
                <p>Last practiced: ${data.last_practiced}</p>
            `;

            skillsContainer.prepend(card);
            skillForm.reset();
            modal.style.display = "none";
        });
    });
}

/* ------------------------------
   3. SKILL Delete
--------------------------------*/

function initSkillDelete(){
    const skillsBox = document.getElementById("skillsBox");
    if(!skillsBox) return;

    skillsBox.addEventListener("click",function(e){
        const deleteBtn = e.target.closest(".skill_delete_btn");
        if(!deleteBtn) return;

        const skillCard = deleteBtn.closest(".skill-card");
        const skillId = skillCard.dataset.skillId;

        if(!skillId) return;

        if(!confirm("Delete this skill?")) return;

        fetch("/skill/delete/",{
            method:"POST",
            headers:{
                "X-CSRFToken" : document.querySelector("[name=csrfmiddlewaretoken]").value,
                "X-Requested-With": "XMLHttpRequest"
            },
            body : new URLSearchParams({skill_id:skillId})
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                skillCard.remove();
            }else{
                alert(data.error || "Delete Failed!");
            }
        });
    });
}

/* ------------------------------
   4. JOB APPLICATION ADD
--------------------------------*/
function initJobApplicationForm(){
    const jobForm = document.getElementById("jobForm");
    const jobMmodel = document.getElementById("add_job_plate");
    const jobContainer = document.getElementById("job_application_box");

    if(!jobForm || !jobMmodel || !jobContainer) return;

    jobForm.addEventListener("submit", function(e){
        e.preventDefault();

        const jobformData = new FormData(jobForm);
        
        fetch("/jobApplication/add/", {
            method:"POST",
            headers:{
                "X-CSRFToken" : document.querySelector("[name=csrfmiddlewaretoken]").value,
                "X-Requested-With":"XMLHttpRequest"
            },
            body:jobformData
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                alert(data.error);
                return;
            }
            const container = document.querySelector(".job_application_box");

            const emptyState = container.querySelector(".empty_state");
            if (emptyState) {
                emptyState.remove();
            }
            const card = document.createElement("div");
            card.className = "job_card";
            card.setAttribute("data-job-id", data.id);
            card.innerHTML = `
                <button>&times;</button>
                <div>
                    <h2 class="job_title">${data.roleName}</h2>
                    <h3>${data.companyName}</h3>
                    <div>
                        <h4>${data.location}</h4>
                        <h4>${data.jobType}</h4>
                        <h4>${data.salary}</h4>
                    </div>
                    <div>
                        <h4>${data.sourceName}</h4>
                        <h4>${data.created_at}</h4>
                    </div>
                </div>
            `;
            jobContainer.prepend(card);
            jobForm.reset();
            jobMmodel.style.display = "none";
        });
    });
}

function initJobActions() {
    const jobBox = document.getElementById("job_application_box");
    if (!jobBox) return;

    jobBox.addEventListener("click", function (e) {

        /* ---------------------------
           DELETE JOB
        ----------------------------*/
        const deleteBtn = e.target.closest(".job_delete_btn");
        if (deleteBtn) {
            const jobCard = deleteBtn.closest(".job_card");
            const jobId = jobCard.dataset.jobId;

            if (!jobId) return;
            if (!confirm("Delete this job application?")) return;

            fetch("/jobApplication/delete/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: new URLSearchParams({ job_id: jobId })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    jobCard.remove();
                    updateDashboardCntCards();
                    initDashboardChart();
                } else {
                    alert(data.error || "Delete failed");
                }
            });

            return; // stop further checks
        }

        /* ---------------------------
           APPLY JOB (CREATE APPLICATION)
        ----------------------------*/
        const applyBtn = e.target.closest(".create_application_btn");
        if (applyBtn) {
            const jobCard = applyBtn.closest(".job_card");
            const jobId = jobCard.dataset.jobId;

            if (!jobId) return;

            fetch(`/job/${jobId}/apply/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                jobCard.remove();

                const container = document.querySelector(".job_application_box");
                if (container && container.children.length === 0) {
                    container.innerHTML = `
                        <div class="empty_state">
                            <h2>No saved jobs</h2>
                            <p>All saved jobs have been moved to Applications.</p>
                        </div>
                    `;
                }

                updateDashboardCntCards();
                initDashboardChart();
                showToast("Application moved to Applications", "success");
            });
        }

    });
}
/* ------------------------------
   4. Applications PAGE SHOW
--------------------------------*/
function initApplicationFlow(){
    const board = document.querySelector(".application_board");
    if(!board) return;

    board.addEventListener("click", e=>{
        const btn = e.target.closest("button[data-next]");
        if(!btn) return;

        const appCard = btn.closest(".application_card");
        const jobId = card.dataset.id;
        const nextStatus = btn.dataset.next;

        fetch(`/applications/${jobId}/status/`,{
            method:"POST",
            headers:{
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                "X-Requested-With": "XMLHttpRequest"
            },
            body:new URLSearchParams({ status:nextStatus })
        })
        .then(res =>res.json())
        .then(data =>{
            if(data.error){
                alert(data.error);
                return;
            }
            load_content(window.location.pathname);
            updateDashboardCntCards();
            initDashboardChart();
        });
    });
}





/* ------------------------------
   4. AJAX PAGE LOADER
--------------------------------*/
function load_content(url) {
    const contentArea = document.querySelector(".content_area");
    if (!contentArea) return;

    fetch(url, {
        credentials: "same-origin",
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
    })
    .then(html => {
        contentArea.innerHTML = html;
        window.history.pushState({}, "", url);

        initDashboardChart();
        initSkillForm();
        initSkillModal();
        initSkillDelete();
        initJobModel();
        initJobApplicationForm();
        initJobActions();
        updateDashboardCntCards();
        initApplicationFlow();
        initApplicationDetails();
        initRecentApplications();

    })
    .catch(err => console.error("Skill Vault fetch failed:", err));
}



/* ------------------------------
   5. MODAL OPEN / CLOSE
--------------------------------*/
function initSkillModal() {
    const openBtn = document.getElementById("add_btn");
    const modal = document.getElementById("skillmodel");
    const closeBtn = document.getElementById("closeskillModel");

    if (!openBtn || !modal || !closeBtn) return;

    openBtn.onclick = () => (modal.style.display = "flex");
    closeBtn.onclick = () => (modal.style.display = "none");

    modal.onclick = e => {
        if (e.target === modal) modal.style.display = "none";
    };
}

/* ------------------------------
   5. Job MODAL OPEN / CLOSE
--------------------------------*/
function initJobModel(){
    const jobaddbtn = document.getElementById("add_job_btnn");
    const job_model = document.getElementById("add_job_plate");
    const jobClosebtn = document.getElementById("closejobModel");

    if(!job_model || !jobClosebtn || !jobaddbtn) return;

    jobaddbtn.onclick = ()=>(job_model.style.display = "flex");
    jobClosebtn.onclick = ()=>(job_model.style.display = 'none');

    job_model.onclick = e =>{
        if (e.target === job_model) job_model.style.display = 'none'
    };
}
/* ------------------------------
   5. Application MODAL OPEN / CLOSE
--------------------------------*/
function initApplicationDetails(){
    const board = document.querySelector(".application_board");
    const appOverlay = document.getElementById("appDetailOverlay");
    const content = document.getElementById("appDetailContent");
    const closeBtn = document.getElementById("closeAppDetail");

    if(!board || !appOverlay || !content) return;

    board.addEventListener("click", e=>{
        const card = e.target.closest(".application_card");
        if(!card) return;
        const jobId = card.dataset.id;
        fetch(`/application/${jobId}/detail/`,{
            headers:{"X-Requested-With":"XMLHttpRequest"}
        })
        .then(res=>res.text())
        .then(html=>{
            content.innerHTML = html;
            appOverlay.style.display = "flex";
        });
    });
    closeBtn.onclick = () =>appOverlay.style.display = 'none';
    appOverlay.onclick = e =>{
        if(e.target === appOverlay) appOverlay.style.display = 'none';
    };
}

function initAppOverlayActions(){ 
    document.addEventListener("click", function (e) {


        const advanceBtn = e.target.closest(".advance_btn");
        if (advanceBtn) {
            e.preventDefault();
            e.stopPropagation();

            const id = advanceBtn.dataset.id;
            if (!id) return;

            fetch(`/application/${id}/advance/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(res => res.json())
            .then(() => {
                document.getElementById("appDetailOverlay").style.display = "none";
                
                const activeNav = document.querySelector(".nav_item.active");
                if (activeNav) {
                    load_content(activeNav.dataset.url);
                }
                showToast(data.message, "success");
                updateDashboardCntCards();
                initDashboardChart();
            });

            return;
        }

        /* REJECT */
        const rejectBtn = e.target.closest(".reject_btn");
        if (rejectBtn) {
            e.preventDefault();
            e.stopPropagation();

            if (!confirm("Reject this application?")) return;

            const id = rejectBtn.dataset.id;

            fetch(`/application/${id}/rejected/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(() => {
                document.getElementById("appDetailOverlay").style.display = "none";

                const activeNav = document.querySelector(".nav_item.active");
                if (activeNav) {
                    load_content(activeNav.dataset.url);
                }

                showToast(data.message, "success");
                updateDashboardCntCards();
                initDashboardChart();
            });
        }
    });
}


/* ------------------------------
   6. DOM READY
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    initLoginButton();

    const contentArea = document.querySelector(".content_area");
    const dashLink = document.getElementById("dashboard-link");

    // Auto-load dashboard on first visit
    if (contentArea && contentArea.innerHTML.trim() === "" && dashLink) {
        load_content(dashLink.dataset.url);
    }

    /* 🔥 ADD THIS BLOCK HERE 🔥 */
    document.addEventListener("click", function (e) {
        const navItem = e.target.closest(".nav_item");
        if (!navItem) return;

        const url = navItem.dataset.url;
        if (!url) return;

        e.preventDefault();
        load_content(url);

        // Active state handling
        document.querySelectorAll(".nav_item").forEach(n =>
            n.classList.remove("active")
        );
        navItem.classList.add("active");
    });

    // Initializers (safe to keep)
    initDashboardChart();
    initSkillForm();
    initSkillModal();
    initSkillDelete();
    initJobModel();
    initJobApplicationForm();
    initJobActions();
    updateDashboardCntCards();
    initApplicationFlow();
    initAppOverlayActions();
    initApplicationDetails();
    initRecentApplications();
});
