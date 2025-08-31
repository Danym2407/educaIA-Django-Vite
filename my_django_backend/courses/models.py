from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    tags = models.CharField(max_length=200)
    duration = models.CharField(max_length=50)  # Ej: '8 semanas'
    rating = models.FloatField()
    cover_image_url = models.URLField()
    trailer_url = models.URLField(blank=True, null=True)

class Level(models.Model):
    course = models.ForeignKey(Course, related_name='levels', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=1)

class Module(models.Model):
    level = models.ForeignKey(Level, related_name='modules', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=1)

class Lesson(models.Model):
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    duration = models.CharField(max_length=10)  # Ej: '10:32'
    video_id = models.CharField(max_length=20)  # YouTube videoId
    order = models.PositiveIntegerField(default=1)