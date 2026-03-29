from django.db import models

class Project(models.Model):
    STATUS_CHOICES = [
        ('dev', 'Development'),
        ('done', 'Completed'),
    ]

    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='projects_images/')
    description_es = models.TextField(verbose_name='Spanish description', default='Translated text')
    description_en = models.TextField(verbose_name='English description', default='Translated text')
    github_link = models.URLField(blank=True, null=True)
    deploy_link = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='project_images/')
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.project.name} Image"
