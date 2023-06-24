"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure, Select } from '@chakra-ui/react';
import { Flex, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box } from "@chakra-ui/react";
import { AddIcon } from '@chakra-ui/icons'

import { useDispatch, useSelector } from 'react-redux';
import { selectBotConfig, setActiveBotId, createChatbot } from '@/store/slices/botSlice';

import { ChatbotConfig } from "@/shared/types/bot";
import { defaultConfig } from "@/store/slices/botSlice";


const SettingsModal: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const config = useSelector(selectBotConfig);
  const [form, setForm] = useState<ChatbotConfig>(defaultConfig);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const newForm = { ...form, [name]: value }
    setForm(newForm);

    if (newForm.language && newForm.style && newForm.temperature) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();
    onClose();
    const { payload } = await dispatch(createChatbot(form));
    dispatch(setActiveBotId(payload.chatbot_id))
    router.push(`/chat/${payload.chatbot_id}`);
  }

  const handleCancel = () => {
    setIsFormValid(true);
    setForm(config);
    onClose();
  };

  return (
    <div>
      <Button w="44" justifyContent="start" colorScheme="blackAlpha" onClick={onOpen}>
        <AddIcon mr={3} />
        New Chat
      </Button>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Chat</ModalHeader>
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
            <Button isDisabled={!isFormValid} colorScheme="blue" mr={3} onClick={handleSubmit}>
              Apply
            </Button>
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SettingsModal;
