from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    nasa_api_key: str = "DEMO_KEY"
    cache_ttl: int = 3600

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
