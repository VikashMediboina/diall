import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, UIManager, findNodeHandle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


const ToolTip = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const buttonRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const toggleTooltip = () => {
    setTooltipVisible(!isTooltipVisible);
    getPosition();
  };

  const getPosition = () => {
    if (buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setModalPosition({ x: pageX - 200, y: pageY-30 });
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleTooltip} style={styles.infoButton} ref={buttonRef}>
      <Icon
              name="info"
              size={30}
              color={!isTooltipVisible?"white":"#85C623"}
            />
      </TouchableOpacity>

      <Modal
        visible={isTooltipVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleTooltip}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
          onPress={toggleTooltip}
        >
          <View style={[styles.tooltipContainer, { left: modalPosition.x, top: modalPosition.y }]}>
            <View style={styles.tooltipContent}>
              <Text>This is not a substitute for diagnosis or treatment, but if you have a question, you can ask a therapist. 
                
</Text>
<Text></Text>
<Text>
If you're in crisis, please call 988.</Text>
            </View>
            <View style={[styles.tooltipArrowRight,{top: -40 }]} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderColor:'#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltipContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tooltipArrowRight: {
    position:'relative',
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
  },
  tooltipContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width:180,
    // marginRight: 10,
  },
});

export default ToolTip;
