import { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure, Select } from '@chakra-ui/react';
import { Flex, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box } from "@chakra-ui/react";

import { useDispatch, useSelector } from 'react-redux';
import { selectBotId, clearMessageData, deleteChatbot, selectBotConfig, setConfig } from '@/store/slices/botSlice';

import { ChatbotConfig } from "@/shared/types/bot";


const SettingsModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const config = useSelector(selectBotConfig);
  const [form, setForm] = useState<ChatbotConfig>(config);

  const chatbot_id = useSelector(selectBotId);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(setConfig(form));
    onClose();
    InitializeChatbot();
  };

  async function InitializeChatbot() {
    if (chatbot_id === undefined) return

    try {
      dispatch(clearMessageData());
      console.log('delete chatbot');
      await dispatch(deleteChatbot(chatbot_id));
      location.reload();
      } catch (e) {
      console.log(e);
    }
  }

  const handleCancel = () => {
    console.log(config)
    setForm(config);
    onClose();
  };

  return (
    <div>
      <Button colorScheme="blue" onClick={onOpen}>New Chat</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex direction="column">
                <Text mb={2}>Language:</Text>
                <Select placeholder="Select language" name="language" value={form.language} onChange={handleInputChange}>
                  <option value="input">input</option>
                  <option value="ko">ko</option>
                  <option value="en">en</option>
                  <option value="es">es</option>
                  <option value="de">de</option>
                  <option value="fr">fr</option>
                </Select>
                <Text mt={4} mb={2}>Style:</Text>
                <Select placeholder="Select style" name="style" value={form.style} onChange={handleInputChange}>
                  <option value="brief">brief</option>
                  <option value="casual">casual</option>
                  <option value="long">long</option>
                  <option value="polite">polite</option>
                </Select>
                <Text mt={4} mb={2}>Temperature:</Text>
                <Flex align="center" justify="space-between" w="full">
                  <Slider flex="1" aria-label="slider-ex-5" value={form.temperature} onChange={(value) => setForm((prev: ChatbotConfig) => ({ ...prev, temperature: value }))} min={0} max={1} step={0.1}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>
                      <Box color="tomato" />
                      <Text fontSize="sm" ml={2} mr={2}>{form.temperature}</Text>
                    </SliderThumb>
                  </Slider>
                </Flex>
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              New Chat
            </Button>
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SettingsModal;
