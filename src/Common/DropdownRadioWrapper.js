import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { Button, Dropdown, Input, Radio } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { List } from 'react-virtualized'
import './filters.css'
const DropdownRadioWrapper = ({
                                  title = 'Наименование', //наименование фильтра
                                  radiobox = [], //знаячения фильтра
                                  isSearch = false, //доступность к поисковику
                                  setList, //состояние списка примененных фильтров
                                  width = 230,
                                  height = 300,
                                  rowHeight = 30,
                              }) => {
    const [visible, setVisible] = useState(false) //состояние dropdown открыто закрыто
    const [filtered, setFiltered] = useState() //состояние фильтрованных радио кнопок при поисковике
    const [checked, setChecked] = useState(null) //состояние радио кнопки при onChange методе
    const inptRef = useRef(null) //ссылка к dom элементу поисковика

    useEffect(() => {
        const btnClick = () => {
            //сброс отмеченных,но не сохраненных значении радио кнопок
            if (checked) {
                setList((state) => (Object.values(state).length > 0 ? {} : state))
                setChecked(null)
            }
        }

        let btn = document.getElementById('reset')
        btn && btn.addEventListener('click', btnClick)

        return () =>  btn && btn.removeEventListener('click', btnClick)
    }, [title, checked, setList])

    //реализация кнопки сброса фильтра
    const onReset = useCallback(() => {
        setFiltered()
        setChecked(null)

        setList((state) => {
            delete state[title]
            return { ...state }
        })

        if (inptRef && inptRef.current) {
            inptRef.current.state.value = ''
        }
    }, [setList, title])

    //реализация кнопки применения фильтра
    const onSubmit = useCallback(() => {
        setVisible(false)
        setFiltered()
        //отправка отмеченных значении родителю
        setList((state) => ({ ...state, [title]: checked }))

        if (inptRef && inptRef.current) {
            inptRef.current.state.value = ''
        }
    }, [checked, title, setList])

    //реализация изменения радио кнопок
    const onChange = useCallback((e) => {
        setChecked(e.target.value)
    }, [])

    //реализация поисковика
    const onSearch = useCallback(
        (e) => {
            setFiltered(radiobox.filter((value) => value.includes(e.target.value)))
        },
        [radiobox]
    )
    // меню дропдауна
    const menu = useMemo(() => {
        let data = filtered ? filtered : radiobox

        // список радио кнопок
        let list = data.map((i) => (
            <Radio
                className={`Filter_Items_Style`}
                value={i.name}
                disabled={i.disabled}
                key={i.name}
                // style={{ width: 190 }}
            >
                {i.name.slice(0, 25)}
            </Radio>
        ))

        return (
            <div className={`Filter_Checkbox_Container_Style`}>
                {/* поисковик */}
                {isSearch && (
                    <div style={{ margin: 5 }}>
                        <Input
                            onChange={onSearch}
                            ref={inptRef}
                            placeholder={'Поиск'}
                            allowClear
                            className={`Filter_Input_Item_Style`}
                        />
                    </div>
                )}
                {/* виртуальный список */}
                <Radio.Group
                    className={`Filter_Radio_Item_Style`}
                    name={'radiogroup'}
                    value={checked}
                    onChange={onChange}
                    style={{ display: 'flex', padding: 5, width: 230 }}
                >
                    <List
                        className={`Filter_List_Item_Style`}
                        width={width}
                        height={height}
                        rowCount={list.length}
                        rowHeight={rowHeight}
                        rowRenderer={({ key, index, isScrolling, isVisible, style }) => (
                            <div key={key} style={style}>
                                {list[index]}
                            </div>
                        )}
                    />
                </Radio.Group>

                {/* кнопки сброса и применения */}
                <div
                    key={'dropdown-btn'}

                    className={`Filter_Btn_Style_Box`}
                >
                    <Button
                        className={`Filter_Btn_Item_Style`}
                        type='primary'
                        onClick={onReset}
                        hidden={checked ? false : true}
                    >
                        Сбросить
                    </Button>
                    <Button
                        className={`Filter_Btn_Item_Style`}
                        type='primary'
                        onClick={onSubmit}
                        hidden={checked ? false : true}
                    >
                        Применить
                    </Button>
                </div>
            </div>
        )
    }, [
        isSearch,
        radiobox,
        filtered,
        height,
        rowHeight,
        width,
        onChange,
        onSearch,
        onReset,
        onSubmit,
        checked,
    ])

    return (
        <div className={`Dropdown_style`}>
            <Dropdown
                overlay={menu}
                trigger={['click']}
                visible={visible}
                onVisibleChange={(val) => {
                    setVisible(val)
                    //сброс поля поисковика
                    if (inptRef && inptRef.current && inptRef.current.state) {
                        setFiltered()
                        inptRef.current.state.value = ''
                    }
                }}
                overlayClassName={`Filter_Dropdown_Style`}
            >
                <Button
                    className={`Filter_Main_Btn_Style`}
                >
                    {title}
                    <DownOutlined/>
                </Button>
            </Dropdown>
        </div>
    )
}

export default React.memo(DropdownRadioWrapper)
