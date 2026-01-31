from django.urls import path
from . import views

urlpatterns = [
    path("", views.landing, name="landing"),
    path("login/", views.login_view, name = "login_page"),
    path("register/", views.register, name="register_page"),
    path("user/<slug:slug>/main/", views.main, name='main_page'),
    path("user/<slug:slug>/main/dashboard/", views.dashboard_view, name='dashboard_page'),
    path("dashboard_card/counts/", views.dashboard_cnt_cards, name = "dashboard_cnts"),
    path("dashboard/charts/", views.dashboard_chart_update, name = "chart_updates"),
    path("application-recentList/", views.dashboard_application_recent_list, name = "dashboard_application_recentList"),
    path("user/<slug:slug>/dashboard/skills/", views.skills, name="skill_page"),
    path("skills/add/", views.add_skills_to_vault, name="add_skill"),
    path("skill/delete/", views.delete_skill, name='delete_skill'),
    path("user/<slug:slug>/dashboard/job_tracker/", views.job_tracker, name="job_tracker_page"),
    path("jobApplication/add/", views.add_jobApplication, name="add_jobApplication"),
    path("jobApplication/delete/", views.delete_job, name="delete_job"),
    path("job/<int:id>/apply/", views.apply_job, name="apply_job"),
    path("user/<slug:slug>/dashboard/applications/",views.applicaton_tracker, name="applicaton_tracker_page"),
    path("applications/<int:id>/status/",views.update_application_status, name = "update_application_status"),
    path("application/<int:id>/detail/",views.application_detail ,name="application_detail"),
    path("application/<int:id>/advance/", views.advance_application, name = "application_advance"),
    path("application/<int:id>/rejected/", views.reject_application, name="rejected_app"),
    path("logout/", views.logout_view, name='logout'),
]
