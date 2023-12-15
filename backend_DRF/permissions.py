from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user


# GET-запросы видны всем(
class IsOwnerAndIsOtherUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or obj.other_user == request.user
