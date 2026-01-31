from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ('firstname','lastname', "email", 'password')
    
    def create(self, validated_data):
        email = validated_data['email']
        user = User.objects.create_user(
            username = email,
            firstname = validated_data['firstname'],
            lastname = validated_data['lastname'],
            email=email,
            password= validated_data['password']
        )
        return user