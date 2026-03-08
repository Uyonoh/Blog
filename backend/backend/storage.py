# Custom whitenoise storage
from whitenoise.storage import ManifestStaticFilesStorage,CompressedManifestStaticFilesStorage
from whitenoise.storage import MissingFileError


class IgnoreMissingManifestStorage(CompressedManifestStaticFilesStorage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def process_missing_files(self, files):
        for name, hashed_name, processed in files:
            if isinstance(processed, MissingFileError):
                # Skip if missing
                continue
            yield name, hashed_name, processed

    def post_process(self, *args, **kwargs):
        files = ManifestStaticFilesStorage.post_process(*args, **kwargs)
        files = self.process_missing_files(files)

        if not kwargs.get("dry_run"):
            files = self.post_process_with_compression(files)

        # Make exception messages helpful
        for name, hashed_name, processed in files:
            yield name, hashed_name, processed