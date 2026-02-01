/* ------------------------------
   CAREERFLOW APP.JS - FIXED
--------------------------------*/

function getCSRFToken() {
    const meta = document.querySelector("meta[name='csrf-token']");
    const middleware = document.querySelector("[name=csrfmiddlewaretoken]");
    return meta ? meta.getAttribute("content") : (middleware ? middleware.value : "");
}

/* ------------------------------
   0. LOGIN BUTTON HANDLER
--------------------------------*/
function initLoginButton() {
    const loginbtn = document.getElementById("login_btn");
    if (!loginbtn) return;  
    
    loginbtn.addEventListener("click", (e) => {
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        
        if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
            alert("Please fill in all fields!");
            e.preventDefault();
            return;
        }
        loginbtn.textContent = "Verifying...";
        loginbtn.style.backgroundColor = "skyblue";
    });
}

/* ------------------------------
   1. FLASH MESSAGE HANDLER
--------------------------------*/
function initFlashMessages() {
    const msg = document.getElementById("messages");
    if (msg) {
        setTimeout(() => {
            msg.style.opacity = "0";
            setTimeout(() => (msg.style.display = "none"), 500);
        }, 5000);
    }
}


/* ------------------------------
   2. DASHBOARD CHART (SAFE)
--------------------------------*/
const ChartManager = (() => {
    let pipelineChart = null;

    function destroy() {
        if (pipelineChart) {
            pipelineChart.destroy();
            pipelineChart = null;
        }
    }

    function render() {
        destroy();

        const canvas = document.getElementById("pipelineChart");
        if (!canvas) return;

        // wait for layout
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                fetch("/dashboard/charts/", {
                    headers: { "X-Requested-With": "XMLHttpRequest" }
                })
                .then(res => res.json())
                .then(data => {

                    if (!document.body.contains(canvas)) return;

                    pipelineChart = new Chart(canvas.getContext("2d"), {
                        type: "bar",
                        data: {
                            labels: ["Saved", "Applied", "Interview", "Offer", "Accepted", "Rejected"],
                            datasets: [{
                                data: [
                                    data.saved,
                                    data.applied,
                                    data.interview,
                                    data.offer,
                                    data.accepted,
                                    data.rejected
                                ],
                                backgroundColor: [
                                    "#94a3b8",
                                    "#3b82f6",
                                    "#facc15",
                                    "#22c55e",
                                    "#16a34a",
                                    "#ef4444"
                                ],
                                borderRadius: 6,
                                barThickness: 30
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true },
                                x: { grid: { display: false } }
                            }
                        }
                    });
                });

            });
        });
    }

    return {
        render,
        rerender: render,
        destroy
    };
})();

/* ------------------------------
   2. DASHBOARD JOB CARDS COUNT
--------------------------------*/
function updateDashboardCntCards() {
    const totalJobs = document.getElementById("totalJobs");
    if (!totalJobs) return; 

    fetch("/dashboard_card/counts/", {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(res => res.json())
    .then(data => {
        const appliedJobs = document.getElementById("appliedJobs");
        const Interviews = document.getElementById("jobInterviews");
        const offers = document.getElementById("jobOffers");

        if (totalJobs) totalJobs.textContent = data.total_jobs;
        if (appliedJobs) appliedJobs.textContent = data.applied_jobs;
        if (Interviews) Interviews.textContent = data.got_interviews;
        if (offers) offers.textContent = data.job_offers;
    });
}

/* ------------------------------
   3. DASHBOARD RECENT ACTIVITIES
--------------------------------*/
function initRecentApplications() {
    const recentbox = document.getElementById("recentActivityList");
    if (!recentbox) return;

    fetch("/application-recentList/", {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(res => res.text())
    .then(html => {
        recentbox.innerHTML = html;
    });
}

/* ------------------------------
   3. SKILL FORM & DELETE
--------------------------------*/
function initSkillForm() {
    const skillForm = document.getElementById("skillForm");
    const modal = document.getElementById("skillmodel");
    const skillsContainer = document.getElementById("skillsBox");

    if (!skillForm || !skillsContainer) return;

    skillForm.onsubmit = function (e) {
        e.preventDefault();
        fetch("/skills/add/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest"
            },
            body: new FormData(skillForm)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return alert(data.error);
            const card = document.createElement("div");
            card.className = "skill-card";
            card.innerHTML = `<h3>${data.name}</h3><span class="badge">${data.level}</span><p>Last practiced: ${data.last_practiced}</p>`;
            skillsContainer.prepend(card);
            skillForm.reset();
            if (modal) modal.style.display = "none";
        });
    };
}

function initSkillDelete() {
    const skillsBox = document.getElementById("skillsBox");
    if (!skillsBox) return;

    skillsBox.onclick = function (e) {
        const deleteBtn = e.target.closest(".skill_delete_btn");
        if (!deleteBtn) return;

        const skillCard = deleteBtn.closest(".skill-card");
        if (!confirm("Delete this skill?")) return;

        fetch("/skill/delete/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest"
            },
            body: new URLSearchParams({ skill_id: skillCard.dataset.skillId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) skillCard.remove();
            else alert(data.error || "Delete Failed!");
        });
    };
}

/* ------------------------------
   4. JOB APPLICATIONS
--------------------------------*/
function initJobApplicationForm() {
    const jobForm = document.getElementById("jobForm");
    const jobContainer = document.getElementById("job_application_box");

    if (!jobForm || !jobContainer) return;

    jobForm.onsubmit = function (e) {
        e.preventDefault();
        fetch("/jobApplication/add/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest"
            },
            body: new FormData(jobForm)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) return alert(data.error);
            location.reload(); 
        });
    };
}

function initJobActions() {
    const jobBox = document.getElementById("job_application_box");
    if (!jobBox) return;

    jobBox.onclick = function (e) {
        const deleteBtn = e.target.closest(".job_delete_btn");
        const applyBtn = e.target.closest(".create_application_btn");

        if (deleteBtn) {
            const jobCard = deleteBtn.closest(".job_card");
            if (!confirm("Delete this job?")) return;
            fetch("/jobApplication/delete/", {
                method: "POST",
                headers: { "X-CSRFToken": getCSRFToken(), "X-Requested-With": "XMLHttpRequest" },
                body: new URLSearchParams({ job_id: jobCard.dataset.jobId })
            }).then(() => jobCard.remove());
        }

        if (applyBtn) {
            const jobCard = applyBtn.closest(".job_card");
            fetch(`/job/${jobCard.dataset.jobId}/apply/`, {
                method: "POST",
                headers: { "X-CSRFToken": getCSRFToken(), "X-Requested-With": "XMLHttpRequest" }
            }).then(() => {
                jobCard.remove();
                updateDashboardCntCards();
                ChartManager.rerender();
            });
        }
    };
}

/* ------------------------------
   5. AJAX PAGE LOADER (CRITICAL FIX)
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
        // Destroy old chart BEFORE DOM replacement
        ChartManager.destroy();

        contentArea.innerHTML = html;
        window.history.pushState({}, "", url);

        requestAnimationFrame(() => {
            setTimeout(() => {
                if (url.includes("dashboard") || url === "/" || url === "") {
                    ChartManager.render();
                    updateDashboardCntCards();
                    initRecentApplications();
                }

                initSkillForm();
                initSkillModal();
                initSkillDelete();
                initJobModel();
                initJobApplicationForm();
                initJobActions();
                initApplicationFlow();
                initApplicationDetails();
            }, 0);
        });
    })
    .catch(err => console.error("Fetch failed:", err));
}


/* ------------------------------
   6. MODAL UTILS
--------------------------------*/
function initSkillModal() {
    const openBtn = document.getElementById("add_btn");
    const modal = document.getElementById("skillmodel");
    const closeBtn = document.getElementById("closeskillModel");
    if (!openBtn || !modal || !closeBtn) return;
    openBtn.onclick = () => (modal.style.display = "flex");
    closeBtn.onclick = () => (modal.style.display = "none");
}

function initJobModel() {
    const jobaddbtn = document.getElementById("add_job_btnn");
    const job_model = document.getElementById("add_job_plate");
    const jobClosebtn = document.getElementById("closejobModel");
    if (!job_model || !jobaddbtn) return;
    jobaddbtn.onclick = () => (job_model.style.display = "flex");
    if (jobClosebtn) jobClosebtn.onclick = () => (job_model.style.display = 'none');
}

function initApplicationDetails() {
    const board = document.querySelector(".application_board");
    const appOverlay = document.getElementById("appDetailOverlay");
    const content = document.getElementById("appDetailContent");
    if (!board || !appOverlay) return;

    board.onclick = e => {
        const card = e.target.closest(".application_card");
        if (!card) return;
        fetch(`/application/${card.dataset.id}/detail/`, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        })
        .then(res => res.text())
        .then(html => {
            content.innerHTML = html;
            appOverlay.style.display = "flex";
        });
    };
}

function initApplicationFlow() {
    const board = document.querySelector(".application_board");
    if (!board) return;
    board.addEventListener("click", e => {
        const btn = e.target.closest("button[data-next]");
        if (!btn) return;
        const jobId = btn.closest(".application_card").dataset.id;
        fetch(`/applications/${jobId}/status/`, {
            method: "POST",
            headers: { "X-CSRFToken": getCSRFToken(), "X-Requested-With": "XMLHttpRequest" },
            body: new URLSearchParams({ status: btn.dataset.next })
        }).then(() => load_content(window.location.pathname));
    });
}

/* ------------------------------
   7. DOM READY
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    initLoginButton();
    initFlashMessages();

    const contentArea = document.querySelector(".content_area");
    const dashLink = document.getElementById("dashboard-link");

    if (contentArea && contentArea.innerHTML.trim() === "" && dashLink) {
        load_content(dashLink.dataset.url);
    }

    document.addEventListener("click", e => {
        const navItem = e.target.closest(".nav_item");
        if (!navItem || !navItem.dataset.url) return;
        e.preventDefault();
        
        document.querySelectorAll(".nav_item").forEach(n => n.classList.remove("active"));
        navItem.classList.add("active");
        load_content(navItem.dataset.url);
    });
});