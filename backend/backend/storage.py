# Custom whitenoise storage
from whitenoise.storage import CompressedManifestStaticFilesStorage


class IgnoreMissingManifestStorage(CompressedManifestStaticFilesStorage):
    def url(self, name, **kwargs):
        try:
            return super().url(name, **kwargs)
        except (ValueError, FileNotFoundError):
            # If the file (like the .map file) is missing, 
            # just return the original name instead of crashing
            return name