'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ExternalLink, BookOpen, Users, Shield, Heart } from 'lucide-react'

const TERMS_ACCEPTED_KEY = 'guono_dictionary_terms_accepted'

interface TermsConditionsPopupProps {
  onAccept?: () => void
}

export default function TermsConditionsPopup({ onAccept }: TermsConditionsPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    // Check if user has already accepted terms
    const accepted = localStorage.getItem(TERMS_ACCEPTED_KEY)
    if (!accepted) {
      setIsOpen(true)
    } else {
      setHasAccepted(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(TERMS_ACCEPTED_KEY, 'true')
    setHasAccepted(true)
    setIsOpen(false)
    onAccept?.()
  }

  if (hasAccepted) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        showCloseButton={false}
        className="bg-[#1E1E1E] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full  from-[#F5DEB3] to-[#D4AF37] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#1E1E1E]" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl text-white">
                Welcome to Guọnọ Dictionary
              </DialogTitle>
              <p className="text-sm text-[#F5DEB3] mt-1 font-medium">Eyeyono — Continuous Learning</p>
            </div>
          </div>
          <DialogDescription className="text-gray-300 text-base">
            Before you explore our dictionary, please review our terms of use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Key Points Summary */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#2a2a2a] border border-white/5">
              <Heart className="w-5 h-5 text-[#F5DEB3] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm">Purpose of Use</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Guọnọ Dictionary is an educational and cultural resource for personal learning, linguistic research, and promoting the everyday use of the Urhobo language.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#2a2a2a] border border-white/5">
              <Users className="w-5 h-5 text-[#F5DEB3] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm">Content Sharing</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Content within the dictionary can be freely shared to promote Urhobo language revitalization. Please do not misrepresent content or use it for harmful purposes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#2a2a2a] border border-white/5">
              <Shield className="w-5 h-5 text-[#F5DEB3] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm">Acceptable Use</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Please use the dictionary respectfully. Do not post harmful information, abuse features, or misrepresent GUỌNỌ. Violations may result in account restrictions.
                </p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 rounded-lg bg-[#F5DEB3]/10 border border-[#F5DEB3]/20">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-[#F5DEB3]">Note:</span> Urhobo has diverse dialects. We strive to represent commonly accepted forms while honoring variations. The dictionary is provided &apos;as is&apos; and GUỌNỌ is not liable for any inaccuracies.
            </p>
          </div>

          {/* Full Terms Link */}
          <a
            href="https://guono.up.railway.app/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#F5DEB3] hover:text-[#ffe6b0] transition-colors text-sm font-medium group"
          >
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            Read the complete Terms & Conditions
          </a>
        </div>

        <DialogFooter className="flex flex-col gap-4 sm:flex-col">
          {/* Checkbox */}
          <div className="flex items-start gap-3 w-full">
            <Checkbox
              id="terms-checkbox"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked === true)}
              className="mt-0.5 border-gray-500 data-[state=checked]:bg-[#F5DEB3] data-[state=checked]:border-[#F5DEB3] data-[state=checked]:text-[#f5deb3]"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-sm text-gray-300 cursor-pointer leading-relaxed"
            >
              I have read and agree to the{' '}
              <a
                href="https://guono.up.railway.app/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5DEB3] hover:underline"
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Accept Button */}
          <Button
            onClick={handleAccept}
            disabled={!isChecked}
            className="w-full bg-[#F5DEB3] text-[#1E1E1E] hover:bg-[#ffe6b0] disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-5"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

