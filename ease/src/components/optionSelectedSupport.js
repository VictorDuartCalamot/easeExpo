import { useState } from "react";
import { View, Button } from "react-native";
import SelectedOptionPicker from 'selected-option-picker'

const OptionSupport = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [name, setName] = useState('');
    //const [data, setData] = useState([]);

    const data = [
        {
            name: "Seoul",
        },
        {
            name: "Toronto",
        },
    ]

    return(
        <View>
            <Button
                title={'Show Country Picker'}
                onPress={() => setShowPicker(true)}
            />

            <SelectedOptionPicker
                showPicker={showPicker}
                data={data}
                pickerTitle={'Select Name'}
                checkBoxType={'circle'}
                itemTitleKey={'name'}
                itemTitleValue={name.name}
                itemUniqueKey={'id'}
                itemUniqueValue={name.id}
                enableSearch={true}
                searchPlaceholder={'Search name'}
                emptyTitle={'No Country(s) Found'}
                onDonePress={() => setShowPicker(false)} 
                onCancelPress={() => setShowPicker(false)} 
                onItemChange={item => setName(item)}
            />
        </View>
    )
}

export default OptionSupport;