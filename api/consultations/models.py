from django.db import models


class LowercaseSlugField(models.SlugField):
    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        return value if value is None else value.lower()


class Prospect(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}: {self.email}"


class Consultation(models.Model):
    prospect = models.OneToOneField(
        Prospect, on_delete=models.CASCADE, related_name="consultation"
    )
    message = models.TextField()
    slug = LowercaseSlugField(max_length=100, unique=True)

    def __str__(self):
        return f"Consultation for {self.prospect.first_name} {self.prospect.last_name}: {self.prospect.email}"
