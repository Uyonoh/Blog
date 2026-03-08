# Custom whitenoise storage
from whitenoise.storage import ManifestStaticFilesStorage,CompressedManifestStaticFilesStorage
from whitenoise.storage import MissingFileError


class IgnoreMissingManifestStorage(CompressedManifestStaticFilesStorage):
    keep_only_hashed_files = True
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def skip_missing_files(self, files):
        for name, hashed_name, processed in files:
            if isinstance(processed, Exception):
                processed = self.make_helpful_exception(processed, name)
                # Skip if missing
                if isinstance(processed, MissingFileError):
                    continue
            yield name, hashed_name, processed

    def post_process(self, *args, **kwargs):
        files = super().post_process(*args, **kwargs)
        files = self.skip_missing_files(files)

        if not kwargs.get("dry_run"):
            files = self.post_process_with_compression(files)


        for name, hashed_name, processed in files:
            yield name, hashed_name, processed


