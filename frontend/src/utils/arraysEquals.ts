/**
 * Проверяет 2 массава на равенство ссылок и содержимого
 * @param l1 массив 1
 * @param l2 массив 2
 */
export default function arraysEquals(l1?: Array<any>, l2?: Array<any>) {
    if (l1 == l2)
        return true;
    if (((l1 == undefined) || (l2 == undefined)) && ((l1 != undefined) || (l2 != undefined)))
        return false;

    //l1 и l2 определены, в противном случае условия выше выполнятся, компилятор не смог распознать
    //поэтому ошибки тайпскрипта подавлены

    // @ts-ignore
    if (l1.length != l2.length)
        return false;

    // @ts-ignore
    for (let i = 0; i < l1.length; ++i) {
        // @ts-ignore
        if (l1[i] !== l2[i])
            return false;
    }
    return true;
}