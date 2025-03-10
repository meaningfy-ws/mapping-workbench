from mapping_workbench.backend.database.adapters.mongodb import DB


async def drop_collections_except(excluded_collections: list[str]):
    db = DB.get_database()

    # Get all collection names
    all_collections = await db.list_collection_names()

    # Drop collections not in the exclusion list
    for collection in all_collections:
        if collection not in excluded_collections:
            await db[collection].drop()
