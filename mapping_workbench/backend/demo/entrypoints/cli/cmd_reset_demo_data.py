import click

from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.demo.services.data import reset_demo_data


async def run():
    await init_project_models(mongodb_database=DB.get_database())
    await reset_demo_data()


@click.command()
def main():
    import asyncio
    asyncio.run(run())


if __name__ == '__main__':
    main()
