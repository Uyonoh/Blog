# Custom whitenoise storage
import os
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed

from django.conf import settings
from whitenoise.storage import ManifestStaticFilesStorage,CompressedManifestStaticFilesStorage
from whitenoise.storage import MissingFileError


class IgnoreMissingManifestStorage(CompressedManifestStaticFilesStorage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def process_missing_files(self, files):
        for name, hashed_name, processed in files:
            if isinstance(processed, Exception):
                processed = self.make_helpful_exception(processed, name)
                if isinstance(processed, MissingFileError):
                    # print(f"Missing {name}")
                    # Skip if missing
                    continue
            print(f"Available {name}: {processed}")
            yield name, hashed_name, processed

    def post_process(self, *args, **kwargs):
        files = ManifestStaticFilesStorage().post_process(*args, **kwargs)
        files = self.process_missing_files(files)

        if not kwargs.get("dry_run"):
            files = self.post_process_with_compression(files)


        for name, hashed_name, processed in files:
            yield name, hashed_name, processed
    
    def compress_files(self, paths):
        extensions = getattr(settings, "WHITENOISE_SKIP_COMPRESS_EXTENSIONS", None)
        self.compressor = self.create_compressor(extensions=extensions, quiet=True)

        def _compress_path(path: str) -> list[tuple[str, str]]:
            if not os.path.exists(path):
                return []
        
            compressed: list[tuple[str, str]] = []
            full_path = self.path(path)
            prefix_len = len(full_path) - len(path)
            for compressed_path in self.compressor.compress(full_path):
                compressed_name = compressed_path[prefix_len:]
                compressed.append((path, compressed_name))
            return compressed

        with ThreadPoolExecutor() as executor:
            futures = (
                executor.submit(_compress_path, path)
                for path in paths
                if self.compressor.should_compress(path)
            )
            for future in as_completed(futures):
                yield from future.result()








