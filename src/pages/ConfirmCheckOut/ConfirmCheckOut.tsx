import { useState } from 'react';

import './ConfirmCheckOut.css';

import { X } from 'lucide-react';

import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import InputField from '../../components/InputField/InputField';
import PageLoader from '../../components/PageLoader/PageLoader';

import { supabase } from '../../lib/supabase';

type ConfirmCheckOutProps = {
  tenantId: number;

  tenantName: string;

  tenantCode: string;

  assignmentId: number;

  latestDueId: number | null;

  currentDue: number;

  deposit: number;

  bedNumber: number;

  roomNumber: number;

  blockNumber: number;

  floorNumber: number;

  sharing: number;

  facilities: string;

  onCancel: () => void;

  onConfirmed: () => void;
};

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function getBlockName(blockNumber: number) {
  return `Block ${String.fromCharCode(64 + blockNumber)}`;
}

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, '0');

  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function ConfirmCheckOut({
  tenantName,
  tenantCode,
  assignmentId,
  currentDue,
  deposit,
  bedNumber,
  roomNumber,
  blockNumber,
  floorNumber,
  sharing,
  facilities,
  onCancel,
  onConfirmed,
}: ConfirmCheckOutProps) {
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * Deposit - Dues
   *
   * Negative = amount to collect
   * Zero or positive = refund
   */

  const settlement = deposit - currentDue;

  const settlementLabel = settlement < 0 ? 'Collect' : 'Refund';

  const settlementValue = formatCurrency(Math.abs(settlement));

  async function handleConfirm() {
    if (saving) {
      return;
    }

    setError(null);

    setSaving(true);

    try {
      /*
       * Checkout must only close the
       * active bed assignment.
       *
       * Dues and deposit are historical
       * financial records and are not
       * modified during checkout.
       */

      const { error: checkoutError } = await supabase
        .from('bed_assignments')
        .update({
          check_out_date: getTodayDate(),
        })
        .eq('id', assignmentId)
        .is('check_out_date', null);

      if (checkoutError) {
        throw checkoutError;
      }

      onConfirmed();
    } catch (checkoutError) {
      console.error('Unable to check out tenant:', checkoutError);

      setError('Unable to check out tenant. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/*
       * Checkout uses the same GuestCare saving convention:
       * stable action labels plus one masked Lottie progress state.
       */}
      <PageLoader loading={saving} message="Checking Out..." mask />

      <div className="confirm-checkout-overlay" role="presentation">
        <section
          className="confirm-checkout"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-checkout-title"
        >
          <header className="confirm-checkout-header">
            <h2 id="confirm-checkout-title">Confirm Check Out</h2>

            <IconButton
              type="button"
              icon={<X />}
              label="Close check out"
              onClick={onCancel}
              disabled={saving}
            />
          </header>

          <div className="confirm-checkout-body">
            <section className="confirm-checkout-summary">
              <div className="confirm-checkout-name">
                <span>{tenantName}</span>

                <strong>{tenantCode}</strong>
              </div>

              <div className="confirm-checkout-bed">
                Bed {bedNumber} • Room {roomNumber}
              </div>

              <div className="confirm-checkout-bed-details">
                <span>
                  {getBlockName(blockNumber)} • Floor {floorNumber} • {sharing}{' '}
                  Sharing
                </span>

                <small>{facilities}</small>
              </div>
            </section>

            <section className="confirm-checkout-financials">
              <div className="confirm-checkout-financial-row">
                <InputField
                  id="confirm-checkout-dues"
                  label="Dues"
                  type="text"
                  value={formatCurrency(currentDue)}
                  readOnly
                />

                <InputField
                  id="confirm-checkout-deposit"
                  label="Deposit"
                  type="text"
                  value={formatCurrency(deposit)}
                  readOnly
                />
              </div>

              <InputField
                id="confirm-checkout-settlement"
                label={settlementLabel}
                type="text"
                value={settlementValue}
                readOnly
              />
            </section>

            {error && (
              <div className="confirm-checkout-error" role="alert">
                {error}
              </div>
            )}
          </div>

          <footer className="confirm-checkout-footer">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="button" onClick={handleConfirm} disabled={saving}>
              Confirm
            </Button>
          </footer>
        </section>
      </div>
    </>
  );
}

export default ConfirmCheckOut;
