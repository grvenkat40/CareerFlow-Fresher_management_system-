from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse  
from django.contrib import messages
from django.http import HttpResponse
from .models import User,Skills, JobApplication

def landing(request):
    return render(request, 'landing_page.html')

# -------------------------------------------------------------------------

def register(request):
    if request.method == 'POST':
        first_name = request.POST.get("firstname")
        last_name = request.POST.get('lastname')
        email = request.POST.get('email')
        password = request.POST.get('password')
        if User.objects.filter(email = email).exists():
            messages.error(request, "Username already exists")
            return redirect('login_page')
        user = User.objects.create_user(
            username= email,
            first_name = first_name,
            last_name = last_name,
            email = email,
            password= password
        )
        messages.success(request, "Registration successful.Please login")
        return redirect("login_page")
    return render(request, 'register_page.html')

# -------------------------------------------------------------------------


def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username = email, password = password)
        if user is not None:
            login(request, user)
            messages.success(request, f"Welcome back, {user.first_name}! Successfully logged in.")
            return redirect("main_page", user.slug)
        else:
            messages.error(request, "Invalid email or password")
            return redirect("login_page")

    return render(request, "login_page.html")

# -------------------------------------------------------------------------


@login_required(login_url = 'login_page')
def main(request, slug):
    if request.user.slug != slug:
        return redirect("main_page", slug = request.user.slug)

    return render(request, "main.html")

@login_required
def dashboard_view(request, slug):
    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        return render(request, "partials/dashboard.html")

    return render(request, "dashboard_page.html")

@login_required
def dashboard_cnt_cards(request):
    user = request.user

    data = {
        "total_jobs" : JobApplication.objects.filter(user = user).count(),
        "applied_jobs" : JobApplication.objects.filter(user = user, status = "Applied").count(),
        "got_interviews" : JobApplication.objects.filter(user = user, status = "Interview").count(),
        "job_offers" : JobApplication.objects.filter(user = user, status= "Offer").count()
    }
    return JsonResponse(data)

@login_required
def dashboard_chart_update(request):
    user = request.user
    data = {
        "saved": JobApplication.objects.filter(user=user, status="Saved").count(),
        "applied": JobApplication.objects.filter(user=user, status="Applied").count(),
        "interview": JobApplication.objects.filter(user=user, status="Interview").count(),
        "offer": JobApplication.objects.filter(user=user, status="Offer").count(),
        "accepted": JobApplication.objects.filter(user=user, status="Accepted").count(),
        "rejected": JobApplication.objects.filter(user=user, status="Rejected").count(),
    }
    return JsonResponse(data)

@login_required
def dashboard_application_recent_list(request):
    user = request.user
    jobs = JobApplication.objects.filter(user = user).order_by('-id')[:3]

    return render(request, "partials/recent_applications.html", {"jobs":jobs})

# -------------------------------------------------------------------------


@login_required
def skills(request, slug):
    if request.user.slug != slug:
        if request.headers.get("x-requested-with") != "XMLHttpRequest":
            return redirect("skill_page", slug=request.user.slug)
        return HttpResponse(status=403)


    skills = Skills.objects.filter(user=request.user)

    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        return render(request, "partials/skill_vault.html", {"skills": skills})

    return render(request, "skill_vault_page.html", {"skills": skills})


@login_required
@require_POST
def add_skills_to_vault(request):
    skillName = request.POST.get("skillName")
    skillLevel = request.POST.get("proficiency")

    if not skillName:
        return JsonResponse({"error": "Skill name required"}, status=400)
    skill = Skills.objects.create(
        user = request.user,
        skill_name = skillName,
        skill_level = skillLevel 
    )
    return JsonResponse({
        "id": skill.id,
        "name": skill.skill_name,
        "level": skill.skill_level,
        "last_practiced": skill.last_practiced.strftime("%d %b %Y")
    })
@login_required
@require_POST
def delete_skill(request):
    skill_id = request.POST.get("skill_id")
    try:
        skill = Skills.objects.get(id = skill_id, user = request.user)
        skill.delete()
        return JsonResponse({"success":True})
    except Skills.DoesNotExist:
        return JsonResponse({"error":"Skill not found"},status = 404)

# -------------------------------------------------------------------------


@login_required
def job_tracker(request,slug):
    if request.user.slug != slug:
        if request.headers.get("x-requested-with") != "XMLHttpRequest":
             return redirect("job_tracker_page", slug = request.user.slug)
        return HttpResponse(status=403)
    
    jobs = JobApplication.objects.filter(status = "Saved",user=request.user)

    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        return render(request, 'partials/job_tracker.html',{"jobs":jobs})
    
    return render(request, 'job_tracker_page.html',{"jobs":jobs})

@login_required
@require_POST
def add_jobApplication(request):
    companyName = request.POST.get("companyName")
    roleName = request.POST.get("roleName")
    location = request.POST.get("locationName")
    jobType = request.POST.get("jobType")
    sourceName = request.POST.get("sourceName")
    salary = request.POST.get("salary")

    if not all([companyName, roleName, location, jobType, sourceName]):
        return JsonResponse(
            {"error": "All required fields must be filled"},
            status=400
        )

    job = JobApplication.objects.create(
        user = request.user,
        companyName = companyName,
        roleName =roleName,
        location =location,
        jobType =jobType,
        sourceName =sourceName,
        salary =salary
    )
    return JsonResponse({
        "id":job.id,
        "companyName":companyName,
        "roleName":roleName,
        "location":location,
        "jobType":jobType,
        "sourceName":sourceName,
        "salary":salary,
        "created_at":job.created_at.strftime("%d %b %Y")
    })

@login_required
@require_POST
def delete_job(request):
    job_id = request.POST.get("job_id")

    try:
        job = JobApplication.objects.get(id = job_id, user = request.user)
        job.delete()
        return JsonResponse({"success":True})
    except JobApplication.DoesNotExist:
        return JsonResponse({"error":"job not found"}, status=404)

@login_required
@require_POST
def apply_job(request, id):
    try:
        job = JobApplication.objects.get(
            id = id,
            user = request.user,
            status = "Saved"
        )
    except JobApplication.DoesNotExist:
        return JsonResponse({"error":"Job not found!"}, status = 404)
    
    job.status = "Applied"
    job.save()

    return JsonResponse({
        "success": True,
        "job_id": job.id,
        "status": job.status,
        "applied_at": job.created_at.strftime("%d %b %Y")
    })







# -------------------------------------------------------------------------


@login_required
def applicaton_tracker(request, slug):
    if request.user.slug != slug:
        if request.headers.get("x-requested-with") != 'XMLHttpRequest':
            return redirect("applicaton_tracker_page", slug= request.user.slug)
        return HttpResponse(status=203)
    
    applications = JobApplication.objects.filter(
        user = request.user,
    ).exclude(status = 'Saved')

    context = {
        "applied": applications.filter(status="Applied"),
        "interview": applications.filter(status="Interview"),
        "offer": applications.filter(status="Offer"),
        "accepted": applications.filter(status="Accepted"),
        "rejected": applications.filter(status="Rejected"),
    }

    if request.headers.get("x-requested-with") == 'XMLHttpRequest':
        return render(request, 'partials/application_tracker.html', context)

    return render(request, 'application_tracker_page.html', context)

@login_required
@require_POST
def update_application_status(request, id):
    new_status = request.POST.get("status")

    allowed = ["Interview", "Offer", "Accepted", "Rejected"]
    if new_status not in allowed:
        return JsonResponse({"error":"Invalied status"}, status = 400)
    
    try:
        job = JobApplication.objects.get(
            id = id, 
            user = request.user
        )
    except JobApplication.DoesNotExist:
        return JsonResponse({"error":"Not found"} ,status = 404)
    
    job.status = new_status
    job.save()

    return JsonResponse({
        "success":True,
        "job_id":job.id,
        "new_status":job.status
    })

@login_required
def application_detail(request, id):
    job = get_object_or_404(JobApplication, id=id, user = request.user)

    return render(request, "partials/application_detail.html", {"job":job})


@login_required
@require_POST
def advance_application(request, id):

    NEXT_STATUS = {
        "Applied": "Interview",
        "Interview": "Offer",
        "Offer": "Accepted"
    }

    job = get_object_or_404(JobApplication, id = id, user = request.user)

    if job.status not in NEXT_STATUS:
        return JsonResponse({"error":"Cannot advance"}, status= 400)

    job.status = NEXT_STATUS[job.status]
    job.save()

    return JsonResponse({
        "success": True,
        "new_status": job.status,
        "message": "Application moved forward successfully"
    })

@login_required
@require_POST
def reject_application(request, id):
    job = get_object_or_404(JobApplication, id=id, user=request.user)
    job.status = "Rejected"
    job.save()
    return JsonResponse({"success": True}, {"message":"Ohh! It's Ok, You can do better!"})

def logout_view(request):
    logout(request)
    return redirect("login_page")