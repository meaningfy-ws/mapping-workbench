from typing import Dict, List


def sort_by_size_and_alphabet(l: List) -> List:
    """
        Sort an iterable by size and alphabetically
    :param l:
    :return:
    """
    return sorted(l, key=lambda x: (len(x), x))


def invert_dict(mapping_dict: Dict, reduce_values: bool = True):
    """
        Invert the dictionary by swapping keys and values. In case the values are unique then the inverted dict will be
        of the same size as the initial one. Otherwise it will be shrunk to the unique values and the keys will be
        cumulated in a list.

        The list can be reduced to single item by setting reduce_values=True.

        >>> d = {"a":1, "b":2, "c":1}
        >>> reduced_d = invert_dict(d)
        {1: 'a', 2: 'b'}

        >>> unreduced_d = invert_dict(d, False)
        {1: ['a', 'c'], 2: ['b']}

        :param reduce_values: If reduce_values is true then the values are single items otherwise
                                the values are list of possibly multiple items.
        :type mapping_dict: a dictionary to be inverted
    """
    inv_map = {}
    for k, v in mapping_dict.items():
        inv_map[v] = inv_map.get(v, [])
        inv_map[v].append(k)
    if reduce_values:
        return {k: sort_by_size_and_alphabet(v)[0] for k, v in inv_map.items()}
    return inv_map