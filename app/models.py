from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.conf import settings

class User(AbstractUser):
    slug = models.SlugField(unique=True, blank =True)
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.first_name)
            slug = base_slug
            counter = 1
             
            while User.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter +=1
            self.slug = slug
        super().save(*args, **kwargs)

class Skills(models.Model):
    LEVEL_CHOICE=[
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    skill_name = models.CharField(max_length=150)
    skill_level = models.CharField(max_length=20, choices=LEVEL_CHOICE)
    last_practiced = models.DateField(auto_now=True)
    create_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.skill_name} ({self.skill_level})"

class JobApplication(models.Model):
    JOBTYPE_CHOICE =[
        ("Full-time", "Full-time"),
        ("Part-time", "Part-time"),
        ("Internship", "Internship"),
        ("Contract", "Contract"),
        ("Freelance", "Freelance")
    ]
    STATUS_CHOICES = [
    ("Saved", "Saved"),
    ("Applied", "Applied"),
    ("Interview", "Interview"),
    ("Offer", "Offer"),
    ("Accepted", "Accepted"),
    ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=100)
    roleName = models.CharField(max_length=100)
    location = models.CharField(max_length=250)
    jobType = models.CharField(max_length=50, choices=JOBTYPE_CHOICE)
    sourceName = models.CharField(max_length=250)
    salary = models.CharField(max_length=50)
    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Saved"
    )
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.companyName} - {self.roleName} ({self.status})"

