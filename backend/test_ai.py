
import asyncio

from ai_service import generate_json


async def main():
    result = await generate_json(
        feature="construction_chatbot",
        user_input="Name three common materials used in concrete.",
        output_instructions=(
            'Return an object with a "materials" array '
            "containing three material names."
        ),
    )

    print(result)


if __name__ == "__main__":
    asyncio.run(main())
