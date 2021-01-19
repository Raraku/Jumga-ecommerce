import random
import string


def get_random_alphanumeric_string(string_length=15):
    letters_and_digits = string.ascii_letters + string.digits
    return "".join((random.choice(letters_and_digits) for _ in range(string_length)))
