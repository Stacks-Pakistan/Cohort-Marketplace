(impl-trait .sip010-ft-trait.sip010-ft-trait)
;; ft
;; <add a description here>

;; constants
;;
(define-constant ERR_NOT_OWNER (err u999))
(define-fungible-token cohort-currency)

;; data maps and vars
;;
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_NOT_OWNER)
        (try! (ft-transfer? cohort-currency amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

(define-read-only (get-name)
    (ok "Cohort Currency")
)

(define-read-only (get-symbol)
    (ok "CC")
)

(define-read-only (get-decimals)
    (ok u6)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance cohort-currency who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply cohort-currency))
)

(define-read-only (get-token-uri)
    (ok none)
)

(define-public (mint! (amount uint))
 
    (ft-mint? cohort-currency amount tx-sender)

)

(define-public (burn! (amount uint))
 
    (ft-burn? cohort-currency amount tx-sender)

)

;; private functions
;;

;; public functions
;;
