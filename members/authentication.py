from django.contrib.auth.backends import BaseBackend
from members.models import CustomUser

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = CustomUser
        try:
            user = UserModel.objects.get(email=email)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None

    def get_user(self, user_id):
        UserModel = CustomUser
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None