# Custom whitenoise storage
from whitenoise.storage import CompressedManifestStaticFilesStorage
from whitenoise.storage import MissingFileError


class IgnoreMissingManifestStorage(CompressedManifestStaticFilesStorage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    def post_process(self, *args, **kwargs):
        files = super().post_process(*args, **kwargs)

        if not kwargs.get("dry_run"):
            files = self.post_process_with_compression(files)

        # Make exception messages helpful
        for name, hashed_name, processed in files:
            if isinstance(processed, MissingFileError):
                processed = True
            yield name, hashed_name, processed