DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT
            c.relname AS sequence_name,
            t.relname AS table_name,
            a.attname AS column_name
        FROM
            pg_class c
            JOIN pg_depend d ON d.objid = c.oid
            JOIN pg_class t ON d.refobjid = t.oid
            JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid
        WHERE
            c.relkind = 'S' -- only sequences
            AND d.deptype = 'a' -- only automatically created dependencies (like serial)
    LOOP
        EXECUTE format(
            'SELECT setval(''%I'', COALESCE((SELECT MAX(%I) FROM %I), 1))',
            rec.sequence_name,
            rec.column_name,
            rec.table_name
        );
        RAISE NOTICE 'Resynced % with MAX(%).', rec.sequence_name, rec.column_name;
    END LOOP;
END $$;
