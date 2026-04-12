PROMPT_TEMPLATE = """
Generate {n_questions} {q_type} questions IN LATEX CODE
(only the code that would go between the begin document command
and the end document command) that would test a student's
knowledge of the things discussed in the following transcript
(DO NOT USE THE EXACT QUESTIONS IN THE TRANSCRIPT):
{transcript}
"""


def build_prompt(n_questions: int, q_type: str, transcript: str) -> str:
    return PROMPT_TEMPLATE.format(
        n_questions=n_questions, q_type=q_type, transcript=transcript
    )
