"use client";

import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useAddPlaceDraft } from "./context";

const LocationForm = () => {
  const { location: formData, setLocation: setFormData } = useAddPlaceDraft();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Location Details</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        {/* State */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="state">{t("places.form.stateLabel", "State")}</label>
          <input
            type="text"
            id="state"
            placeholder={t("places.form.statePh", "Enter the state")}
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="lga">L.G.A</label>
          <select
            onChange={(e) => setFormData({ ...formData, LGA: e.target.value })}
            id="lga"
            className="input h-12"
          >
            {["Warri"].map((lga) => (
              <option
                key={lga}
                value={lga}
                className="text-white bg-secondary-bg"
              >
                {lga}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="province">Province</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, province: e.target.value })
            }
            id="province"
            className="input h-12"
          >
            {["Agabrho"].map((province) => (
              <option
                key={province}
                value={province}
                className="text-white bg-secondary-bg"
              >
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Coord */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="long">{t("places.form.longLabel", "Longitude")}</label>
            <input
              type="text"
              id="long"
              placeholder={t("places.form.longPh", "Enter longitude")}
              value={formData.long}
              onChange={(e) =>
                setFormData({ ...formData, long: e.target.value })
              }
              className="input"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="lat">{t("places.form.latLabel", "Latitude")}</label>
            <input
              type="text"
              id="lat"
              placeholder={t("places.form.latPh", "Enter latitude")}
              value={formData.lat}
              onChange={(e) =>
                setFormData({ ...formData, lat: e.target.value })
              }
              className="input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="city">{t("places.form.cityLabel", "City")}</label>
          <input
            type="text"
            id="city"
            placeholder={t("places.form.cityPh", "Enter the city")}
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="country">{t("places.form.countryLabel", "Country")}</label>
          <input
            type="text"
            id="country"
            placeholder={t("places.form.countryPh", "Enter the country")}
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="address">{t("places.form.addressLabel", "Address")}</label>
          <input
            type="text"
            id="address"
            placeholder={t("places.form.addressPh", "Enter the street address")}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
