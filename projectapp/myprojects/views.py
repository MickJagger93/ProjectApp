from django.shortcuts import render
from .models import Project

def my_projects(request):
    projects = Project.objects.all().order_by('-created_at')
    return render(request, 'myprojects/my_projects.html', {'projects': projects})
